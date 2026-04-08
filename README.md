## Talks

[中文版本](README_zh.md)

| Date | Event | Co-speaker(s) | Session title | Language | Slides |
|------|-------|---------------|---------------|----------|--------|
| 2026 | KCD Beijing | Cyclinder (DaoCloud) | A Huge Cluster or Multi-Clusters? Identifying the Bottleneck | ZH | [Slides](https://github.com/pacoxu/talks/blob/main/tasks/kcd-beijing-2026-huge-cluster/dist/Huge-Cluster-or-Multi-Clusters-KCD-Beijing-2026-final.pdf) / [Video](https://www.bilibili.com/video/BV1QZDLBxEWS) |
| 2025 | KCD Hangzhou | - | Keynotes-2 Kubernetes 社区新动向：AI Gateway, Integration 与 Conformance 工作组建立 | ZH | [Slides / Video](https://www.bilibili.com/video/BV1LkUYBCEZ1) |
| 2025 | KubeCon + CloudNativeCon China | ZhenYu Jiang; Mengjiao Liu | Kubernetes New Contributor Orientation | ZH | [Slides / Video](https://www.youtube.com/watch?v=5UABmfrYu9s) |
| 2025 | KubeCon EU (London) | Saiyam Pathak | A Huge Cluster or Multi-Clusters? Identifying the Bottleneck | EN | [Slides / Video](https://www.youtube.com/watch?v=6l5zCt5QsdY) |
| 2024 | KubeCon + CloudNativeCon + OSS + AI_Dev China | Wei Cai | Keynote: Kubernetes Community and Cloud Native Activities in China | EN | [Slides / Video](https://www.youtube.com/watch?v=c9YVuEkJGR0) |
| 2024 | KubeCon EU (Paris) | Nabarun Pal | Kubernetes Steering Committee: Genesis, Bootstrap, Now & Future | EN | [Session](https://sched.co/1YhgX) |
| 2024 | Kubernetes Contributor Summit EU | Kubernetes Steering Committee | Steering AMA | EN | [Session](https://youtu.be/1Ia75WgGC0g?si=5EjP7XlzgM1-q-8O) |
| 2024 | KCD Shanghai | Nikhita Raghunath; Madhav Jivrajani | Cloud Native Novice & OpenSource Education Track: Kubernetes Contributor Journeys | EN | [Slides / Video](https://www.bilibili.com/video/BV1nD421T786/?spm_id_from=333.999.0.0) |
| 2023 | KubeCon China (Shanghai) | Xiongxiong Yuan | Kubernetes SIG Node Intro and Deep Dive | EN | [Session](https://kccncosschn2023.sched.com/event/4a2746baff6af89d668edc2eabbcf906) |
| 2023 | KubeCon China (Shanghai) | Byron Wang | How Can Pod Start-up Be Accelerated on Nodes in Large Clusters? | EN | [Session](https://sched.co/1PTFR) |
| 2023 | KubeCon EU (Amsterdam) | Rohit Anand | Kubeadm Deep Dive | EN | [Session](https://kccnceu2023.sched.com/event/1Iki0/kubeadm-deep-dive-rohit-anand-nec-paco-xu-dao-cloud) |
| 2021 | KubeCon China (Virtual) | - | Kubernetes SIG Node: Intro and Deep Dive | ZH | [Session](https://kccncosschn21.sched.com/event/pccE/kubernetes-sig-nodedaeptao-ye-ge-kubernetes-sig-node-intro-and-deep-dive-paco-daocloud) |
| 2021 | KCD Shanghai | - | Kubeadm & SIG Node Intro and How to Contribute | ZH | [Slides](https://github.com/cncf/presentations/tree/main/chinese/kcd-shanghai) |

my talks/sessions in KubeCon, KCD and other activities.

## KCD Links

- KCD 资料总入口（中文）：https://github.com/cncf/presentations/tree/main/chinese
- KCD Beijing（与 vLLM 北京合办）Slides：https://github.com/cncf/presentations/tree/main/chinese/kcd-beijing
- KCD Chengdu Slides：https://github.com/cncf/presentations/tree/main/chinese/kcd-chengdu
- KCD Dalian Slides：https://github.com/cncf/presentations/tree/main/chinese/kcd-dalian
- KCD Shanghai Slides：https://github.com/cncf/presentations/tree/main/chinese/kcd-shanghai
- KCD Beijing（与 vLLM 北京合办）Sessionize：https://sessionize.com/app/organizer/event/evaluation/rate/22079/8786
- KCD 视频（B 站）：https://space.bilibili.com/1274679632
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
