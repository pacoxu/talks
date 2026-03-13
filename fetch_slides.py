#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import posixpath
import re
import sys
from collections import deque
from dataclasses import asdict, dataclass
from datetime import UTC, datetime
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable
from urllib.error import HTTPError, URLError
from urllib.parse import unquote, urldefrag, urljoin, urlparse
from urllib.request import Request, urlopen


USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/134.0.0.0 Safari/537.36"
)
DOWNLOADABLE_EXTENSIONS = {
    ".key",
    ".odp",
    ".pdf",
    ".potx",
    ".pps",
    ".ppsx",
    ".ppt",
    ".pptm",
    ".pptx",
    ".zip",
}
DOWNLOAD_HINTS = {
    "deck",
    "download",
    "handout",
    "pdf",
    "presentation",
    "resource",
    "slide",
    "slides",
}
SCHED_EVENT_PATH = re.compile(r"^/event/[^/?#]+(?:/[^/?#]+)?/?$")
DATE_PATTERNS = (
    re.compile(r"(20\d{2})[-_]?([01]\d)[-_]?([0-3]\d)"),
    re.compile(r"([0-3]\d)[-_]([01]\d)[-_](20\d{2})"),
)


class LinkExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.links: list[tuple[str, str]] = []
        self._href: str | None = None
        self._text_parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag != "a":
            return
        attributes = dict(attrs)
        href = attributes.get("href")
        if href:
            self._href = href
            self._text_parts = []

    def handle_data(self, data: str) -> None:
        if self._href is not None:
            self._text_parts.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag != "a" or self._href is None:
            return
        text = " ".join(part.strip() for part in self._text_parts if part.strip())
        self.links.append((self._href, text))
        self._href = None
        self._text_parts = []


@dataclass
class AssetCandidate:
    source_url: str
    asset_url: str
    anchor_text: str
    discovered_order: int
    last_modified: str | None = None
    last_modified_ts: float | None = None
    content_type: str | None = None
    filename: str | None = None
    downloaded_to: str | None = None
    error: str | None = None

    def sort_key(self) -> tuple[int, float, datetime, int, str]:
        last_modified_rank = 1 if self.last_modified_ts is not None else 0
        filename_date = infer_date(self.filename or self.asset_url)
        return (
            last_modified_rank,
            self.last_modified_ts or 0.0,
            filename_date,
            score_candidate(self),
            self.asset_url,
        )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Download slide files from session pages, including Sched event links."
    )
    parser.add_argument("urls", nargs="+", help="Session, speaker, or event page URLs.")
    parser.add_argument(
        "-o",
        "--output-dir",
        default="downloads",
        help="Directory for downloaded files. Default: downloads",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Download every discovered candidate instead of the latest candidate per source page.",
    )
    parser.add_argument(
        "--crawl-same-host",
        action="store_true",
        help="Crawl other same-host pages in addition to built-in Sched event discovery.",
    )
    parser.add_argument(
        "--max-pages",
        type=int,
        default=50,
        help="Maximum number of HTML pages to scan. Default: 50",
    )
    parser.add_argument(
        "--manifest",
        default="downloads/manifest.json",
        help="Where to write the JSON manifest. Default: downloads/manifest.json",
    )
    parser.add_argument(
        "--timeout",
        type=float,
        default=20.0,
        help="Per-request timeout in seconds. Default: 20",
    )
    return parser.parse_args()


def normalize_url(url: str) -> str:
    url = urldefrag(url).url.strip()
    parsed = urlparse(url)
    if not parsed.scheme:
        url = f"https://{url}"
        parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"}:
        raise ValueError(f"unsupported URL scheme: {parsed.scheme!r}")
    return url


def build_request(url: str, method: str = "GET") -> Request:
    return Request(
        url,
        method=method,
        headers={
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": USER_AGENT,
        },
    )


def fetch(url: str, timeout: float, method: str = "GET") -> tuple[str, object, bytes]:
    request = build_request(url, method=method)
    with urlopen(request, timeout=timeout) as response:
        body = b"" if method == "HEAD" else response.read()
        return response.geturl(), response.headers, body


def fetch_metadata(url: str, timeout: float) -> tuple[str, object]:
    try:
        final_url, headers, _ = fetch(url, timeout=timeout, method="HEAD")
        return final_url, headers
    except HTTPError as exc:
        if exc.code not in {403, 405, 501}:
            raise
    final_url, headers, _ = fetch(url, timeout=timeout, method="GET")
    return final_url, headers


def is_downloadable_url(url: str, anchor_text: str = "") -> bool:
    parsed = urlparse(url)
    path = unquote(parsed.path or "").lower()
    if any(path.endswith(extension) for extension in DOWNLOADABLE_EXTENSIONS):
        return True
    text = f"{path} {anchor_text}".lower()
    return any(hint in text for hint in DOWNLOAD_HINTS) and any(
        marker in text for marker in (".pdf", ".ppt", ".pptx", "download", "slide", "presentation")
    )


def should_queue_page(url: str, current_url: str, root_hosts: set[str], crawl_same_host: bool) -> bool:
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"}:
        return False
    if is_downloadable_url(url):
        return False
    if parsed.netloc not in root_hosts:
        return False
    if crawl_same_host:
        return True
    if parsed.netloc.endswith("sched.com") and SCHED_EVENT_PATH.match(parsed.path):
        return True
    return False


def extract_links(html: str) -> list[tuple[str, str]]:
    parser = LinkExtractor()
    parser.feed(html)
    return parser.links


def parse_last_modified(value: str | None) -> tuple[str | None, float | None]:
    if not value:
        return None, None
    try:
        dt = parsedate_to_datetime(value)
    except (TypeError, ValueError, IndexError):
        return value, None
    return value, dt.timestamp()


def infer_date(text: str) -> datetime:
    for pattern in DATE_PATTERNS:
        match = pattern.search(text)
        if not match:
            continue
        groups = match.groups()
        if len(groups[0]) == 4:
            year, month, day = groups
        else:
            day, month, year = groups
        try:
            return datetime(int(year), int(month), int(day))
        except ValueError:
            continue
    return datetime.min


def score_candidate(candidate: AssetCandidate) -> int:
    haystack = f"{candidate.filename or ''} {candidate.anchor_text} {candidate.asset_url}".lower()
    score = 0
    if ".pdf" in haystack:
        score += 20
    elif ".pptx" in haystack:
        score += 15
    elif ".ppt" in haystack:
        score += 10
    for hint in DOWNLOAD_HINTS:
        if hint in haystack:
            score += 2
    return score


def choose_candidates(candidates: Iterable[AssetCandidate], include_all: bool) -> list[AssetCandidate]:
    if include_all:
        return sorted(candidates, key=lambda candidate: candidate.sort_key(), reverse=True)

    latest_by_source: dict[str, AssetCandidate] = {}
    for candidate in candidates:
        current = latest_by_source.get(candidate.source_url)
        if current is None or candidate.sort_key() > current.sort_key():
            latest_by_source[candidate.source_url] = candidate
    return sorted(latest_by_source.values(), key=lambda candidate: candidate.source_url)


def safe_filename(name: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9._-]+", "_", name.strip())
    return cleaned.strip("._") or "downloaded_file"


def filename_from_headers(headers: object) -> str | None:
    get_filename = getattr(headers, "get_filename", None)
    if callable(get_filename):
        filename = get_filename()
        if filename:
            return safe_filename(filename)
    disposition = getattr(headers, "get", lambda *_: None)("Content-Disposition")
    if not disposition:
        return None
    match = re.search(r"filename\*=UTF-8''([^;]+)", disposition, flags=re.IGNORECASE)
    if match:
        return safe_filename(unquote(match.group(1)))
    match = re.search(r'filename="?([^";]+)"?', disposition, flags=re.IGNORECASE)
    if match:
        return safe_filename(match.group(1))
    return None


def filename_from_url(url: str) -> str:
    parsed = urlparse(url)
    name = posixpath.basename(unquote(parsed.path)) or "download"
    return safe_filename(name)


def unique_path(target: Path) -> Path:
    if not target.exists():
        return target
    stem = target.stem
    suffix = target.suffix
    counter = 2
    while True:
        candidate = target.with_name(f"{stem}-{counter}{suffix}")
        if not candidate.exists():
            return candidate
        counter += 1


def crawl(urls: list[str], timeout: float, max_pages: int, crawl_same_host: bool) -> list[AssetCandidate]:
    roots = [normalize_url(url) for url in urls]
    root_hosts = {urlparse(url).netloc for url in roots}
    queue = deque(roots)
    visited: set[str] = set()
    candidates: dict[tuple[str, str], AssetCandidate] = {}
    order = 0

    while queue and len(visited) < max_pages:
        current = queue.popleft()
        if current in visited:
            continue
        visited.add(current)

        try:
            final_url, headers, body = fetch(current, timeout=timeout, method="GET")
        except (HTTPError, URLError, TimeoutError, ValueError) as exc:
            print(f"warn: failed to fetch page {current}: {exc}", file=sys.stderr)
            continue

        content_type = getattr(headers, "get_content_type", lambda: None)()
        if is_downloadable_url(final_url) or (content_type and not content_type.startswith("text/html")):
            key = (current, final_url)
            if key not in candidates:
                candidates[key] = AssetCandidate(
                    source_url=current,
                    asset_url=final_url,
                    anchor_text="",
                    discovered_order=order,
                    content_type=content_type,
                    filename=filename_from_headers(headers) or filename_from_url(final_url),
                )
                order += 1
            continue

        html = body.decode("utf-8", errors="replace")
        for href, text in extract_links(html):
            absolute = urldefrag(urljoin(final_url, href)).url
            if is_downloadable_url(absolute, text):
                key = (final_url, absolute)
                if key in candidates:
                    continue
                candidates[key] = AssetCandidate(
                    source_url=final_url,
                    asset_url=absolute,
                    anchor_text=text,
                    discovered_order=order,
                )
                order += 1
                continue
            if should_queue_page(absolute, final_url, root_hosts, crawl_same_host) and absolute not in visited:
                queue.append(absolute)

    return list(candidates.values())


def enrich_metadata(candidates: list[AssetCandidate], timeout: float) -> None:
    for candidate in candidates:
        try:
            final_url, headers = fetch_metadata(candidate.asset_url, timeout=timeout)
        except (HTTPError, URLError, TimeoutError) as exc:
            candidate.error = f"metadata lookup failed: {exc}"
            continue
        candidate.asset_url = final_url
        candidate.content_type = getattr(headers, "get_content_type", lambda: None)()
        candidate.filename = filename_from_headers(headers) or filename_from_url(final_url)
        candidate.last_modified, candidate.last_modified_ts = parse_last_modified(
            getattr(headers, "get", lambda *_: None)("Last-Modified")
        )


def download(candidate: AssetCandidate, output_dir: Path, timeout: float) -> None:
    try:
        final_url, headers, body = fetch(candidate.asset_url, timeout=timeout, method="GET")
    except (HTTPError, URLError, TimeoutError) as exc:
        candidate.error = f"download failed: {exc}"
        return

    candidate.asset_url = final_url
    candidate.content_type = getattr(headers, "get_content_type", lambda: None)()
    candidate.filename = filename_from_headers(headers) or candidate.filename or filename_from_url(final_url)
    target = unique_path(output_dir / candidate.filename)
    target.write_bytes(body)
    candidate.downloaded_to = str(target)
    candidate.last_modified, candidate.last_modified_ts = parse_last_modified(
        getattr(headers, "get", lambda *_: None)("Last-Modified")
    )


def write_manifest(path: Path, candidates: list[AssetCandidate]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "generated_at": datetime.now(UTC).isoformat(timespec="seconds").replace("+00:00", "Z"),
        "downloads": [asdict(candidate) for candidate in candidates],
    }
    path.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def main() -> int:
    args = parse_args()
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    try:
        discovered = crawl(
            args.urls,
            timeout=args.timeout,
            max_pages=args.max_pages,
            crawl_same_host=args.crawl_same_host,
        )
    except ValueError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    if not discovered:
        print("No slide candidates found.", file=sys.stderr)
        write_manifest(Path(args.manifest), [])
        return 1

    enrich_metadata(discovered, timeout=args.timeout)
    selected = choose_candidates(discovered, include_all=args.all)

    for candidate in selected:
        download(candidate, output_dir=output_dir, timeout=args.timeout)

    write_manifest(Path(args.manifest), selected)

    success_count = sum(1 for candidate in selected if candidate.downloaded_to)
    print(f"Downloaded {success_count} file(s) to {output_dir}")
    if success_count != len(selected):
        failed = [candidate for candidate in selected if not candidate.downloaded_to]
        for candidate in failed:
            print(f"- failed: {candidate.asset_url} ({candidate.error or 'unknown error'})", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
