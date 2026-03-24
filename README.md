# talks
my talks/sessions in KubeCon, KCD and other activities.

## KCD Links

- KCD presentation 仓库（中文区）：https://github.com/cncf/presentations/tree/main/chinese
- KCD Beijing slides 目录：https://github.com/cncf/presentations/tree/main/chinese/kcd-beijing
- KCD 视频（B 站）：https://space.bilibili.com/1274679632
- vLLM 北京 Sessionize（organizer 入口）：https://sessionize.com/app/organizer/event/evaluation/rate/22079/8786
- 当前本仓库最终稿：`tasks/kcd-beijing-2026-huge-cluster/dist/Huge-Cluster-or-Multi-Clusters-KCD-Beijing-2026-final.pdf`

## slides-crawl 用法

项目地址：https://github.com/pacoxu/slides-crawl

核心逻辑：
- 针对 `https://<event>.sched.com/list/descriptions/` 页面抓取 `.pdf/.pptx` 链接。
- 默认输出目录是 `downloaded_slides/`。
- 可通过 `SCHED_LINK` 指定具体活动地址。

本地运行：

```bash
python3 -m pip install requests BeautifulSoup4
python3 validate_url.py https://kccncna2025.sched.com/list/descriptions/
export SCHED_LINK=https://kccncna2025.sched.com/list/descriptions/
python3 download_slides.py
```

Docker 运行：

```bash
docker run -e SCHED_LINK=https://kccnceu2025.sched.com/list/descriptions/ ghcr.io/pacoxu/slides-crawl:latest
docker run -v $(pwd)/downloads:/app/downloaded_slides -e SCHED_LINK=https://kccncna2025.sched.com/list/descriptions/ ghcr.io/pacoxu/slides-crawl:latest
```

## KubeCon 在 sched.com 的常规主题

实操上最常用的是：
- 活动总页：`/list/descriptions/`
- 按主题筛选：`/list/descriptions/type/<Topic>`

根据 `kccnceu2025` 与 `kccncna2025` 两个 sched 页面抽样，常见 topic/track 包括：
- Maintainer Track
- Project Opportunities（含 Project Lightning Talk 等子类）
- Solutions Showcase（含 Demo Theater / In-Booth Demo）
- Platform Engineering
- AI + ML
- Security
- Observability
- Operations + Performance
- Application Development
- Data Processing + Storage
- Connectivity
- Cloud Native Novice / Cloud Native Experience
- Lightning Talks / Tutorials / Poster Sessions / Keynote Sessions
- CNCF-hosted Co-located Events / Sponsor-hosted Co-located Event
