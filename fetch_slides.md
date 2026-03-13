## Fetch slides

`fetch_slides.py` accepts one or more URLs and downloads presentation files it can discover from them.

- Built-in support for `sched.com`-style pages: if you pass a speaker or schedule page, it follows linked session pages under `/event/...`.
- By default it downloads only the latest candidate per source page.
- "Latest" is chosen from HTTP `Last-Modified` when available, then from dates found in filenames, then from slide-oriented filename heuristics.
- Use `--all` to download every candidate instead.

### Examples

```bash
python3 fetch_slides.py https://myevent.sched.com/speaker/some_speaker
python3 fetch_slides.py https://myevent.sched.com/event/abcd/my-talk -o slides
python3 fetch_slides.py https://myevent.sched.com/speaker/some_speaker --all
```

### Output

- Files are downloaded into `downloads/` by default.
- A JSON manifest is written to `downloads/manifest.json` unless overridden with `--manifest`.

