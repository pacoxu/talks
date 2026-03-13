"use strict";

const fs = require("fs");
const path = require("path");
const PptxGenJS = require("pptxgenjs");
PptxGenJS.ShapeType = new PptxGenJS().ShapeType;
const {
  warnIfSlideHasOverlaps,
  warnIfSlideElementsOutOfBounds,
} = require("./pptxgenjs_helpers/layout");

const OUT_DIR = path.join(__dirname, "dist");
const OUT_FILE = path.join(
  OUT_DIR,
  "Huge-Cluster-or-Multi-Clusters-KCD-Beijing-2026.pptx"
);

const W = 13.333;
const H = 7.5;

const COLORS = {
  bg: "F7F1E7",
  paper: "FFFDF9",
  ink: "171717",
  muted: "5E554E",
  line: "DCCDBB",
  red: "C63C30",
  orange: "F28E36",
  gold: "E8C778",
  teal: "2D6E6D",
  blue: "3E6D9C",
  green: "4E7B57",
  white: "FFFFFF",
  dark: "241D1A",
};

const FONT_HEAD = "Avenir Next";
const FONT_BODY = "PingFang SC";
const FONT_MONO = "Menlo";

function text(slide, value, opts) {
  slide.addText(value, {
    fontFace: FONT_BODY,
    color: COLORS.ink,
    margin: 0,
    valign: "mid",
    breakLine: false,
    ...opts,
  });
}

function addChrome(slide, index, section) {
  slide.background = { color: COLORS.bg };
  slide.addShape(PptxGenJS.ShapeType.rect, {
    x: 0,
    y: 0,
    w: W,
    h: H,
    line: { color: COLORS.bg, transparency: 100 },
    fill: { color: COLORS.bg },
  });
  slide.addShape(PptxGenJS.ShapeType.line, {
    x: 0.65,
    y: 0.75,
    w: 12.05,
    h: 0,
    line: { color: COLORS.line, pt: 1.1 },
  });
  slide.addShape(PptxGenJS.ShapeType.rect, {
    x: 0.68,
    y: 0.34,
    w: 0.12,
    h: 0.26,
    line: { color: COLORS.red, transparency: 100 },
    fill: { color: COLORS.red },
    radius: 0.04,
  });
  text(slide, "KCD BEIJING 2026", {
    x: 0.88,
    y: 0.26,
    w: 2.4,
    h: 0.28,
    fontFace: FONT_HEAD,
    fontSize: 9.5,
    bold: true,
    color: COLORS.red,
    charSpace: 1.1,
  });
  if (section) {
    text(slide, section, {
      x: 9.6,
      y: 0.27,
      w: 1.75,
      h: 0.24,
      fontSize: 8.5,
      color: COLORS.muted,
      align: "right",
    });
  }
  slide.addShape(PptxGenJS.ShapeType.ellipse, {
    x: 12.02,
    y: 0.2,
    w: 0.6,
    h: 0.6,
    line: { color: COLORS.orange, transparency: 100 },
    fill: { color: COLORS.orange },
  });
  slide.addShape(PptxGenJS.ShapeType.ellipse, {
    x: 11.72,
    y: 0.5,
    w: 0.2,
    h: 0.2,
    line: { color: COLORS.gold, transparency: 100 },
    fill: { color: COLORS.gold },
  });
  slide.addShape(PptxGenJS.ShapeType.line, {
    x: 0.68,
    y: 6.92,
    w: 12.0,
    h: 0,
    line: { color: COLORS.line, pt: 0.9 },
  });
  text(slide, "Updated from AI-Infra repo content", {
    x: 0.72,
    y: 6.97,
    w: 3.2,
    h: 0.18,
    fontSize: 7.6,
    color: COLORS.muted,
  });
  text(slide, String(index).padStart(2, "0"), {
    x: 12.1,
    y: 6.94,
    w: 0.4,
    h: 0.2,
    fontFace: FONT_HEAD,
    fontSize: 9.5,
    color: COLORS.red,
    bold: true,
    align: "right",
  });
}

function addTitle(slide, kicker, titleValue, subtitleValue) {
  if (kicker) {
    text(slide, kicker, {
      x: 0.78,
      y: 1.03,
      w: 2.8,
      h: 0.28,
      fontFace: FONT_HEAD,
      fontSize: 10,
      bold: true,
      color: COLORS.red,
      charSpace: 1,
    });
  }
  text(slide, titleValue, {
    x: 0.76,
    y: 1.36,
    w: 8.6,
    h: 0.44,
    fontFace: FONT_BODY,
    fontSize: 24,
    bold: true,
  });
  if (subtitleValue) {
    text(slide, subtitleValue, {
      x: 0.78,
      y: 1.82,
      w: 9.5,
      h: 0.28,
      fontSize: 11.5,
      color: COLORS.muted,
    });
  }
}

function addBadge(slide, label, x, y, w, color) {
  slide.addShape(PptxGenJS.ShapeType.roundRect, {
    x,
    y,
    w,
    h: 0.34,
    rectRadius: 0.07,
    line: { color, transparency: 100 },
    fill: { color },
  });
  text(slide, label, {
    x: x + 0.08,
    y: y + 0.03,
    w: w - 0.16,
    h: 0.22,
    fontFace: FONT_HEAD,
    fontSize: 9,
    bold: true,
    color: COLORS.white,
    align: "center",
  });
}

function addCard(slide, card) {
  const {
    x,
    y,
    w,
    h,
    titleValue,
    body,
    fill = COLORS.paper,
    accent = COLORS.red,
    titleColor = COLORS.ink,
    bodyColor = COLORS.muted,
    titleSize = 14,
    bodySize = 10.5,
  } = card;
  slide.addShape(PptxGenJS.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    line: { color: COLORS.line, pt: 1.0 },
    fill: { color: fill },
  });
  slide.addShape(PptxGenJS.ShapeType.rect, {
    x: x + 0.18,
    y: y + 0.16,
    w: 0.08,
    h: 0.34,
    line: { color: accent, transparency: 100 },
    fill: { color: accent },
  });
  text(slide, titleValue, {
    x: x + 0.34,
    y: y + 0.12,
    w: w - 0.54,
    h: 0.34,
    fontSize: titleSize,
    bold: true,
    color: titleColor,
  });
  if (Array.isArray(body)) {
    addBulletList(slide, body, {
      x: x + 0.3,
      y: y + 0.58,
      w: w - 0.48,
      h: h - 0.72,
      fontSize: bodySize,
      color: bodyColor,
      bulletIndent: 12,
      hanging: 3,
      paraSpaceAfterPt: 5,
    });
  } else if (body) {
    text(slide, body, {
      x: x + 0.3,
      y: y + 0.56,
      w: w - 0.48,
      h: h - 0.68,
      fontSize: bodySize,
      color: bodyColor,
      valign: "top",
    });
  }
}

function addBulletList(slide, items, opts) {
  const runs = [];
  items.forEach((item, idx) => {
    runs.push({
      text: item,
      options: {
        bullet: { indent: opts.bulletIndent || 12 },
        hanging: opts.hanging || 3,
        breakLine: idx !== items.length - 1,
      },
    });
  });
  slide.addText(runs, {
    x: opts.x,
    y: opts.y,
    w: opts.w,
    h: opts.h,
    fontFace: FONT_BODY,
    fontSize: opts.fontSize || 11,
    color: opts.color || COLORS.ink,
    margin: 0,
    breakLine: false,
    paraSpaceAfterPt: opts.paraSpaceAfterPt || 4,
    valign: "top",
  });
}

function addColumnsTitle(slide, left, right, y) {
  text(slide, left, {
    x: 0.86,
    y,
    w: 5.5,
    h: 0.28,
    fontSize: 10.5,
    bold: true,
    color: COLORS.red,
  });
  text(slide, right, {
    x: 6.9,
    y,
    w: 5.45,
    h: 0.28,
    fontSize: 10.5,
    bold: true,
    color: COLORS.red,
  });
}

function addTimeline(slide) {
  const entries = [
    ["2018", "OpenAI", "2.5K 节点"],
    ["2020", "Bayer / GKE", "15K 节点"],
    ["2022", "ByteDance", "20K+ 节点"],
    ["2024", "GKE", "65K+ 节点"],
    ["2025", "AWS EKS", "10K 节点"],
    ["2025", "Ant Group", "20K+ 节点"],
    ["2025+", "Google", "130K 节点架构"],
  ];
  slide.addShape(PptxGenJS.ShapeType.line, {
    x: 1.0,
    y: 4.45,
    w: 11.1,
    h: 0,
    line: { color: COLORS.red, pt: 2.2 },
  });
  entries.forEach((entry, idx) => {
    const x = 1.05 + idx * 1.62;
    const yTop = idx % 2 === 0 ? 2.7 : 4.68;
    slide.addShape(PptxGenJS.ShapeType.ellipse, {
      x,
      y: 4.23,
      w: 0.22,
      h: 0.22,
      line: { color: COLORS.red, transparency: 100 },
      fill: { color: COLORS.red },
    });
    slide.addShape(PptxGenJS.ShapeType.line, {
      x: x + 0.11,
      y: idx % 2 === 0 ? yTop + 1.15 : 4.45,
      w: 0,
      h: idx % 2 === 0 ? 1.08 : 0.95,
      line: { color: COLORS.line, pt: 1.2 },
    });
    slide.addShape(PptxGenJS.ShapeType.roundRect, {
      x: x - 0.35,
      y: yTop,
      w: 1.05,
      h: 0.95,
      rectRadius: 0.06,
      line: { color: COLORS.line, pt: 1.0 },
      fill: { color: idx % 2 === 0 ? "FFF7F3" : "FFF8EE" },
    });
    text(slide, entry[0], {
      x: x - 0.24,
      y: yTop + 0.08,
      w: 0.8,
      h: 0.18,
      fontFace: FONT_HEAD,
      fontSize: 8.5,
      bold: true,
      color: COLORS.red,
      align: "center",
    });
    text(slide, entry[1], {
      x: x - 0.27,
      y: yTop + 0.31,
      w: 0.86,
      h: 0.18,
      fontSize: 8.4,
      bold: true,
      align: "center",
    });
    text(slide, entry[2], {
      x: x - 0.27,
      y: yTop + 0.54,
      w: 0.86,
      h: 0.18,
      fontSize: 8.1,
      color: COLORS.muted,
      align: "center",
    });
  });
}

function addSpectrum(slide) {
  const items = [
    ["Namespace", "成本最低", COLORS.blue],
    ["Node Pool", "资源切片", COLORS.teal],
    ["vCluster", "软隔离", COLORS.orange],
    ["Dedicated Cluster", "强隔离", COLORS.red],
    ["Federation", "跨集群治理", COLORS.green],
  ];
  slide.addShape(PptxGenJS.ShapeType.line, {
    x: 1.0,
    y: 4.55,
    w: 11.2,
    h: 0,
    line: { color: COLORS.line, pt: 1.3 },
  });
  items.forEach((item, idx) => {
    const x = 1.0 + idx * 2.25;
    slide.addShape(PptxGenJS.ShapeType.ellipse, {
      x: x + 0.4,
      y: 4.38,
      w: 0.32,
      h: 0.32,
      line: { color: item[2], transparency: 100 },
      fill: { color: item[2] },
    });
    slide.addShape(PptxGenJS.ShapeType.roundRect, {
      x,
      y: 3.05,
      w: 1.5,
      h: 0.9,
      rectRadius: 0.06,
      line: { color: COLORS.line, pt: 1.0 },
      fill: { color: "FFFDF9" },
    });
    text(slide, item[0], {
      x: x + 0.1,
      y: 3.22,
      w: 1.3,
      h: 0.18,
      fontFace: FONT_HEAD,
      fontSize: 9.6,
      bold: true,
      align: "center",
    });
    text(slide, item[1], {
      x: x + 0.14,
      y: 3.5,
      w: 1.22,
      h: 0.16,
      fontSize: 8.1,
      color: COLORS.muted,
      align: "center",
    });
  });
  addBadge(slide, "共享效率", 0.95, 5.1, 1.05, COLORS.teal);
  addBadge(slide, "治理复杂度", 11.3, 5.1, 1.1, COLORS.red);
  slide.addShape(PptxGenJS.ShapeType.line, {
    x: 2.18,
    y: 5.27,
    w: 8.95,
    h: 0,
    line: { color: COLORS.red, pt: 2.2, beginArrowType: "none", endArrowType: "triangle" },
  });
}

function addDecisionRows(slide, rows) {
  rows.forEach((row, idx) => {
    const y = 2.38 + idx * 0.86;
    slide.addShape(PptxGenJS.ShapeType.roundRect, {
      x: 0.86,
      y,
      w: 11.64,
      h: 0.68,
      rectRadius: 0.05,
      line: { color: COLORS.line, pt: 0.9 },
      fill: { color: idx % 2 === 0 ? "FFFDF9" : "FBF7F0" },
    });
    text(slide, row[0], {
      x: 1.05,
      y: y + 0.16,
      w: 1.45,
      h: 0.18,
      fontSize: 10.3,
      bold: true,
      color: COLORS.red,
    });
    text(slide, row[1], {
      x: 2.78,
      y: y + 0.14,
      w: 2.42,
      h: 0.24,
      fontSize: 9.4,
      color: COLORS.ink,
    });
    text(slide, row[2], {
      x: 5.28,
      y: y + 0.14,
      w: 3.05,
      h: 0.24,
      fontSize: 9.4,
      color: COLORS.ink,
    });
    text(slide, row[3], {
      x: 8.62,
      y: y + 0.14,
      w: 3.15,
      h: 0.24,
      fontSize: 9.4,
      color: COLORS.muted,
    });
  });
}

function finalize(slide, pptx) {
  warnIfSlideHasOverlaps(slide, pptx, { muteContainment: true });
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

async function build() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Codex";
  pptx.company = "OpenAI";
  pptx.subject = "Huge Cluster or Multi-Clusters deck updated with AI-Infra content";
  pptx.title = "Huge Cluster or Multi-Clusters? Identifying the Bottleneck";
  pptx.lang = "zh-CN";
  pptx.theme = {
    headFontFace: FONT_HEAD,
    bodyFontFace: FONT_BODY,
    lang: "zh-CN",
  };

  let slide;

  slide = pptx.addSlide();
  slide.background = { color: COLORS.dark };
  slide.addShape(PptxGenJS.ShapeType.rect, {
    x: 0,
    y: 0,
    w: W,
    h: H,
    line: { color: COLORS.dark, transparency: 100 },
    fill: { color: COLORS.dark },
  });
  slide.addShape(PptxGenJS.ShapeType.ellipse, {
    x: 9.95,
    y: 0.85,
    w: 2.2,
    h: 2.2,
    line: { color: COLORS.orange, transparency: 100 },
    fill: { color: COLORS.orange },
  });
  slide.addShape(PptxGenJS.ShapeType.ellipse, {
    x: 10.9,
    y: 3.18,
    w: 0.7,
    h: 0.7,
    line: { color: COLORS.gold, transparency: 100 },
    fill: { color: COLORS.gold },
  });
  slide.addShape(PptxGenJS.ShapeType.line, {
    x: 7.9,
    y: 5.45,
    w: 3.4,
    h: -1.75,
    line: { color: "6B3026", pt: 3.0 },
  });
  slide.addShape(PptxGenJS.ShapeType.line, {
    x: 7.55,
    y: 5.45,
    w: 2.95,
    h: -1.2,
    line: { color: "6B3026", pt: 3.0 },
  });
  slide.addShape(PptxGenJS.ShapeType.line, {
    x: 8.55,
    y: 5.48,
    w: 3.0,
    h: -1.55,
    line: { color: "6B3026", pt: 3.0 },
  });
  text(slide, "KCD BEIJING 2026", {
    x: 0.88,
    y: 0.92,
    w: 2.7,
    h: 0.26,
    fontFace: FONT_HEAD,
    fontSize: 10.5,
    bold: true,
    color: COLORS.gold,
    charSpace: 1.4,
  });
  text(slide, "Huge Cluster or Multi-Clusters?", {
    x: 0.86,
    y: 1.64,
    w: 6.2,
    h: 0.46,
    fontFace: FONT_HEAD,
    fontSize: 25,
    bold: true,
    color: COLORS.white,
  });
  text(slide, "Identifying the Bottleneck", {
    x: 0.86,
    y: 2.26,
    w: 5.8,
    h: 0.32,
    fontFace: FONT_HEAD,
    fontSize: 21,
    bold: true,
    color: COLORS.orange,
  });
  text(slide, "用 AI-Infra 2025-2026 内容重构：不是先问“拆不拆集群”，而是先识别哪一层先撞墙。", {
    x: 0.88,
    y: 3.1,
    w: 6.4,
    h: 0.6,
    fontSize: 12.4,
    color: "E8DDD2",
  });
  addBadge(slide, "CONTROL PLANE", 0.9, 4.45, 1.6, COLORS.red);
  addBadge(slide, "SCHEDULING", 2.7, 4.45, 1.36, COLORS.teal);
  addBadge(slide, "NETWORK", 4.26, 4.45, 1.08, COLORS.blue);
  addBadge(slide, "MULTI-TENANCY", 5.56, 4.45, 1.8, COLORS.green);
  text(slide, "Paco Xu  ·  AI-Infra / Kubernetes / Cloud Native AI Infra", {
    x: 0.9,
    y: 6.45,
    w: 5.6,
    h: 0.22,
    fontSize: 9.5,
    color: "E8DDD2",
  });
  finalize(slide, pptx);

  slide = pptx.addSlide();
  addChrome(slide, 2, "Why Now");
  addTitle(
    slide,
    "WHY THIS QUESTION STILL MATTERS",
    "2026 讨论重点已经变了：不是“集群有多大”，而是“哪一层先成为瓶颈”",
    "AI Infra 把集群扩容从单纯的平台容量问题，变成了控制面、调度、网络和租户治理的联动问题。"
  );
  addCard(slide, {
    x: 0.84,
    y: 2.72,
    w: 2.75,
    h: 2.66,
    titleValue: "对象与状态",
    accent: COLORS.red,
    body: [
      "真正放大的通常是 API 对象总数、watch 流、事件和 operator 状态机",
      "节点数不是唯一指标，object cardinality 往往更早失控",
    ],
  });
  addCard(slide, {
    x: 3.65,
    y: 2.72,
    w: 2.75,
    h: 2.66,
    titleValue: "调度吞吐",
    accent: COLORS.teal,
    body: [
      "AI 训练 / 批处理要求更高的 pod admission 吞吐",
      "默认 kube-scheduler 往往不是最终答案",
    ],
  });
  addCard(slide, {
    x: 6.46,
    y: 2.72,
    w: 2.75,
    h: 2.66,
    titleValue: "网络与拓扑",
    accent: COLORS.blue,
    body: [
      "IP 规划、DNS、跨可用区带宽和 GPU/RDMA 拓扑成为硬瓶颈",
      "AI 工作负载对拓扑感知比传统应用更敏感",
    ],
  });
  addCard(slide, {
    x: 9.27,
    y: 2.72,
    w: 2.75,
    h: 2.66,
    titleValue: "组织边界",
    accent: COLORS.green,
    body: [
      "版本自由度、CRD 冲突、安全隔离、自治权会推动多集群",
      "很多“规模问题”最终其实是治理问题",
    ],
  });
  text(slide, "结论：先识别主瓶颈，再决定是继续做单大集群优化，还是走 vCluster / cell / federation。", {
    x: 0.9,
    y: 5.84,
    w: 11.1,
    h: 0.26,
    fontSize: 11.2,
    bold: true,
  });
  finalize(slide, pptx);

  slide = pptx.addSlide();
  addChrome(slide, 3, "Industry");
  addTitle(
    slide,
    "CASE STUDIES",
    "从 2.5K 到 130K：行业案例说明“上限”在持续抬升，但瓶颈位置并不相同",
    "时间线来自原 deck 与 AI-Infra 仓库中整理的 Bayer、AWS、GKE、ByteDance、Ant 等案例。"
  );
  addTimeline(slide);
  text(slide, "同样是“超大规模”，有的卡在 etcd / API Server，有的卡在 IP 规划，有的卡在调度冲突或多租户治理。", {
    x: 0.96,
    y: 5.72,
    w: 11.2,
    h: 0.26,
    fontSize: 11.1,
    color: COLORS.muted,
  });
  finalize(slide, pptx);

  slide = pptx.addSlide();
  addChrome(slide, 4, "Bottlenecks");
  addTitle(
    slide,
    "BOTTLENECK MAP",
    "超大集群常见的四类瓶颈",
    "这四类问题几乎覆盖了单大集群与多集群选择背后的真实动因。"
  );
  addCard(slide, {
    x: 0.9,
    y: 2.55,
    w: 2.8,
    h: 2.8,
    titleValue: "1. 控制面读写压力",
    accent: COLORS.red,
    body: [
      "etcd 延迟、LIST/WATCH 风暴、APF 排队",
      "大量 operator / agent 直连 API Server",
      "事件流与 heartbeat 频率过高",
    ],
  });
  addCard(slide, {
    x: 3.83,
    y: 2.55,
    w: 2.8,
    h: 2.8,
    titleValue: "2. 调度路径过长",
    accent: COLORS.teal,
    body: [
      "默认调度器吞吐不足",
      "GPU / NUMA / RDMA 约束提高冲突率",
      "批量 admission 没有分层设计",
    ],
  });
  addCard(slide, {
    x: 6.76,
    y: 2.55,
    w: 2.8,
    h: 2.8,
    titleValue: "3. 网络与服务发现",
    accent: COLORS.blue,
    body: [
      "Pod/Service CIDR 不够用",
      "DNS、iptables 或 nftables 同步开销过高",
      "跨 zone / rack 带宽和延迟失衡",
    ],
  });
  addCard(slide, {
    x: 9.69,
    y: 2.55,
    w: 2.8,
    h: 2.8,
    titleValue: "4. 多租户治理失衡",
    accent: COLORS.green,
    body: [
      "Namespace 级隔离不够",
      "CRD / operator 版本冲突",
      "平台团队难以同时满足自治与一致性",
    ],
  });
  finalize(slide, pptx);

  slide = pptx.addSlide();
  addChrome(slide, 5, "Single Cluster");
  addTitle(
    slide,
    "WHEN A HUGE CLUSTER STILL WINS",
    "单大集群成立的前提，是共享收益明显大于组织摩擦",
    "如果这些前提不成立，继续放大一个控制面往往只会把问题放得更大。"
  );
  addColumnsTitle(slide, "适合继续做单大集群", "应该警惕的反信号", 2.48);
  addCard(slide, {
    x: 0.84,
    y: 2.78,
    w: 5.62,
    h: 2.86,
    titleValue: "共享效率能覆盖复杂度",
    accent: COLORS.teal,
    body: [
      "大部分团队接受统一版本窗口、统一 CRD 生命周期和统一平台策略",
      "资源池共享收益高：峰谷互补明显，GPU/CPU 利用率提升能覆盖治理成本",
      "主要瓶颈仍是单一技术面，例如 API 读压或调度吞吐，而不是组织自治",
      "平台团队有能力持续做性能测试、容量规划和升级治理",
    ],
  });
  addCard(slide, {
    x: 6.82,
    y: 2.78,
    w: 5.62,
    h: 2.86,
    titleValue: "组织边界已经超过平台边界",
    accent: COLORS.red,
    body: [
      "不同业务线要求独立 Kubernetes 版本、CRD 版本或安全策略",
      "Namespace 已经无法承载隔离诉求，甚至 kubeconfig 分发都难以治理",
      "单控制面失败域过大，任何 admission / operator 抖动都影响全局",
      "平台团队的目标从“共享效率”变成了“协调冲突”",
    ],
  });
  finalize(slide, pptx);

  slide = pptx.addSlide();
  addChrome(slide, 6, "Control Plane");
  addTitle(
    slide,
    "CONTROL PLANE: FIX THE READ PATH BEFORE REPLACING EVERYTHING",
    "单大集群最先要查的，通常不是“换数据库”，而是读路径、事件路径和组件行为",
    "AI-Infra 梳理的社区更新说明：很多过去必须靠重构解决的问题，已经有更成熟的 upstream 方案。"
  );
  addCard(slide, {
    x: 0.88,
    y: 2.62,
    w: 3.2,
    h: 2.92,
    titleValue: "先看症状",
    accent: COLORS.red,
    body: [
      "LIST / WATCH 抖动",
      "APF 排队拉长",
      "etcd P99 延迟飙升",
      "operator / node agent 直连 API 过多",
    ],
  });
  addCard(slide, {
    x: 4.23,
    y: 2.62,
    w: 4.0,
    h: 2.92,
    titleValue: "近年的社区改进",
    accent: COLORS.orange,
    body: [
      "KEP-2340: Consistent Reads from Cache",
      "KEP-4988: Snapshottable API Server Cache",
      "Paginated API Lists / Watch Bookmark / APF",
      "Efficient Node Heartbeats & Less Object Serializations",
    ],
  });
  addCard(slide, {
    x: 8.38,
    y: 2.62,
    w: 4.0,
    h: 2.92,
    titleValue: "工程上的第一反应",
    accent: COLORS.teal,
    body: [
      "减少 Events 进入主 etcd",
      "避免无必要的 agent 直连 API Server",
      "调低 kubelet / controller 不合理 QPS",
      "把性能测试覆盖到 operator 与 admission webhook",
    ],
  });
  text(slide, "经验法则：如果读路径没有被系统性优化，直接讨论多集群或 etcd replacement，通常只是把根因推迟暴露。", {
    x: 0.92,
    y: 5.8,
    w: 11.25,
    h: 0.26,
    fontSize: 11.1,
    bold: true,
  });
  finalize(slide, pptx);

  slide = pptx.addSlide();
  addChrome(slide, 7, "etcd");
  addTitle(
    slide,
    "ETCD IS A DECISION LADDER, NOT A BINARY SWITCH",
    "从调参到替代存储，应该按阈值逐级上升",
    "AI-Infra 里的案例把这条路拆成了“先优化，再旁路，最后替换”。"
  );
  addCard(slide, {
    x: 0.88,
    y: 2.72,
    w: 2.7,
    h: 2.56,
    titleValue: "阶段 1: 先优化",
    accent: COLORS.red,
    body: [
      "SSD、compact/defrag、心跳与 snapshot 参数",
      "把 Events 与热点读压先挪开",
      "核查对象大小、webhook 耗时、LIST 频率",
    ],
  });
  addCard(slide, {
    x: 3.72,
    y: 2.72,
    w: 2.7,
    h: 2.56,
    titleValue: "阶段 2: 读旁路",
    accent: COLORS.orange,
    body: [
      "一致性缓存、Clusterpedia、只读缓存层",
      "减少 operator 和查询场景对主 API 的依赖",
      "把读压力和写压力拆开看",
    ],
  });
  addCard(slide, {
    x: 6.56,
    y: 2.72,
    w: 2.7,
    h: 2.56,
    titleValue: "阶段 3: 替代后端",
    accent: COLORS.teal,
    body: [
      "Google Spanner",
      "ByteDance KubeBrain / TiKV 路线",
      "Edge 场景可见 Kine",
    ],
  });
  addCard(slide, {
    x: 9.4,
    y: 2.72,
    w: 2.7,
    h: 2.56,
    titleValue: "判断阈值",
    accent: COLORS.green,
    body: [
      "5K 左右：多数问题仍可在 etcd + API 层解决",
      "20K+：开始进入替代元数据系统视野",
      "65K+ / 130K：需要系统级架构设计",
    ],
  });
  finalize(slide, pptx);

  slide = pptx.addSlide();
  addChrome(slide, 8, "Scheduling");
  addTitle(
    slide,
    "SCHEDULING: THROUGHOUT, PARTITIONING, TOPOLOGY",
    "AI 场景下的瓶颈，往往是调度路径太长，而不是单次调度不够聪明",
    "AI-Infra 的调度章节把重点放在吞吐、分层和拓扑感知，而不是继续堆过滤条件。"
  );
  slide.addShape(PptxGenJS.ShapeType.roundRect, {
    x: 0.92,
    y: 2.62,
    w: 2.2,
    h: 2.7,
    rectRadius: 0.08,
    line: { color: COLORS.line, pt: 1.0 },
    fill: { color: "FFF8F5" },
  });
  text(slide, "~100 pods/s", {
    x: 1.12,
    y: 3.0,
    w: 1.8,
    h: 0.38,
    fontFace: FONT_HEAD,
    fontSize: 23,
    bold: true,
    color: COLORS.red,
    align: "center",
  });
  text(slide, "默认 kube-scheduler\n常见量级", {
    x: 1.18,
    y: 3.62,
    w: 1.68,
    h: 0.55,
    fontSize: 10,
    color: COLORS.muted,
    align: "center",
  });
  slide.addShape(PptxGenJS.ShapeType.line, {
    x: 3.28,
    y: 3.96,
    w: 1.05,
    h: 0,
    line: { color: COLORS.red, pt: 2.0, endArrowType: "triangle" },
  });
  slide.addShape(PptxGenJS.ShapeType.roundRect, {
    x: 4.5,
    y: 2.56,
    w: 3.12,
    h: 2.82,
    rectRadius: 0.08,
    line: { color: COLORS.line, pt: 1.0 },
    fill: { color: COLORS.paper },
  });
  text(slide, "提升吞吐的三条路径", {
    x: 4.82,
    y: 2.84,
    w: 2.5,
    h: 0.22,
    fontSize: 13,
    bold: true,
  });
  addBulletList(slide, [
    "Optimistic concurrency",
    "Multi-scheduler / queue partitioning",
    "Hierarchical scheduling",
  ], {
    x: 4.84,
    y: 3.26,
    w: 2.44,
    h: 1.54,
    fontSize: 10.1,
    color: COLORS.ink,
    bulletIndent: 12,
    hanging: 3,
  });
  slide.addShape(PptxGenJS.ShapeType.roundRect, {
    x: 7.96,
    y: 2.56,
    w: 4.2,
    h: 2.82,
    rectRadius: 0.08,
    line: { color: COLORS.line, pt: 1.0 },
    fill: { color: "FBF7F0" },
  });
  text(slide, "常见工具组合", {
    x: 8.3,
    y: 2.84,
    w: 1.8,
    h: 0.22,
    fontSize: 13,
    bold: true,
  });
  addBulletList(slide, [
    "Gödel Scheduler: 5000 pods/s 级吞吐",
    "Kueue / Volcano: 队列与批量 admission",
    "Koordinator / Grove / Kai: 拓扑与 AI 资源感知",
    "Node pool 预分区，降低冲突率和缓存失配",
  ], {
    x: 8.28,
    y: 3.2,
    w: 3.46,
    h: 1.8,
    fontSize: 9.9,
    color: COLORS.ink,
    bulletIndent: 12,
    hanging: 3,
  });
  finalize(slide, pptx);

  slide = pptx.addSlide();
  addChrome(slide, 9, "Network");
  addTitle(
    slide,
    "NETWORK AND TOPOLOGY ARE OFTEN THE FIRST REAL SCALE LIMIT",
    "Bayer 15K 节点案例提醒我们：很多“集群不够大”的根因，其实是 IP 与网络模型先碰到天花板",
    "AI 时代还要额外考虑 GPU / NIC / RDMA 拓扑，不能再把网络当成透明背景。"
  );
  addCard(slide, {
    x: 0.92,
    y: 2.66,
    w: 3.55,
    h: 2.78,
    titleValue: "IP 规划",
    accent: COLORS.blue,
    body: [
      "Bayer 从 route-based networking 转到 VPC-native Alias IP，突破 1K 左右的旧上限",
      "Regional cluster 下要提前做 subnet 和 zone 级容量规划",
    ],
  });
  addCard(slide, {
    x: 4.88,
    y: 2.66,
    w: 3.55,
    h: 2.78,
    titleValue: "服务发现与转发表",
    accent: COLORS.orange,
    body: [
      "EndpointSlice、NodeLocal DNSCache、nftables 都是大规模场景下的重要细节",
      "DNS 与数据面同步延迟常被低估，却会最先被应用侧放大",
    ],
  });
  addCard(slide, {
    x: 8.84,
    y: 2.66,
    w: 3.55,
    h: 2.78,
    titleValue: "AI 拓扑感知",
    accent: COLORS.teal,
    body: [
      "DRA / DRANET / NRI 路线强调网络资源也是一等资源",
      "NUMA、PCIe、NVLink、RDMA 距离会直接决定训练与推理效率",
    ],
  });
  finalize(slide, pptx);

  slide = pptx.addSlide();
  addChrome(slide, 10, "Multi-cluster");
  addTitle(
    slide,
    "MULTI-CLUSTER IS A GOVERNANCE CHOICE AS MUCH AS A SCALING CHOICE",
    "如果主要矛盾来自版本自由度、租户隔离和组织自治，多集群通常比继续放大一个控制面更自然",
    "但多集群不是免费午餐，它会把资源碎片和调度层级问题带回来。"
  );
  addColumnsTitle(slide, "应该拆的典型信号", "拆了以后会新增什么成本", 2.46);
  addCard(slide, {
    x: 0.86,
    y: 2.78,
    w: 5.7,
    h: 2.84,
    titleValue: "触发条件",
    accent: COLORS.green,
    body: [
      "租户之间需要强隔离，Namespace + policy 已经不够",
      "不同团队需要不同 Kubernetes / CRD / operator 生命周期",
      "跨地域、数据主权、故障域和合规要求推动物理拆分",
      "平台团队更需要“自治边界”，而不是继续调和统一平台",
    ],
  });
  addCard(slide, {
    x: 6.78,
    y: 2.78,
    w: 5.7,
    h: 2.84,
    titleValue: "新增代价",
    accent: COLORS.red,
    body: [
      "平台与业务都要承担多层调度、跨集群流量和资源碎片",
      "监控、身份、镜像、配置和升级都变成 fleet 级问题",
      "如果没有 KubeAdmiral / MultiKueue / GitOps 体系，治理成本会迅速反噬",
      "很多“多集群”最后又引入更高一层控制平面",
    ],
  });
  finalize(slide, pptx);

  slide = pptx.addSlide();
  addChrome(slide, 11, "Spectrum");
  addTitle(
    slide,
    "YOU DO NOT NEED TO JUMP FROM NAMESPACES TO FULL FEDERATION IN ONE STEP",
    "更现实的路径，是在共享效率与隔离强度之间找中间态",
    "vCluster、cell-based architecture、dedicated node pool 都是过渡层，而不是只有“一个大集群”或“完全多集群”两种选择。"
  );
  addSpectrum(slide);
  addBulletList(slide, [
    "vCluster 适合把控制面边界先切出来，但底层资源池仍能共享",
    "cell / node pool 适合把 GPU 类型、网络拓扑和升级节奏先分层",
    "KubeAdmiral / MultiKueue 适合把真正的跨集群调度放到更高一层处理",
  ], {
    x: 1.0,
    y: 5.82,
    w: 10.9,
    h: 0.82,
    fontSize: 10.1,
    color: COLORS.ink,
    bulletIndent: 12,
    hanging: 3,
  });
  finalize(slide, pptx);

  slide = pptx.addSlide();
  addChrome(slide, 12, "Decision Matrix");
  addTitle(
    slide,
    "DECISION MATRIX: MAP THE BOTTLENECK TO THE FIRST MOVE",
    "不要先选答案，先判断哪一层出现了最硬的约束",
    "下面这张表是从 AI-Infra 内容中抽出的“瓶颈 -> 第一动作 -> 再评估”路径。"
  );
  text(slide, "主瓶颈", {
    x: 1.06,
    y: 2.12,
    w: 1.2,
    h: 0.18,
    fontSize: 9.4,
    bold: true,
    color: COLORS.red,
  });
  text(slide, "信号", {
    x: 2.78,
    y: 2.12,
    w: 1.0,
    h: 0.18,
    fontSize: 9.4,
    bold: true,
    color: COLORS.red,
  });
  text(slide, "第一动作", {
    x: 5.3,
    y: 2.12,
    w: 1.4,
    h: 0.18,
    fontSize: 9.4,
    bold: true,
    color: COLORS.red,
  });
  text(slide, "再评估", {
    x: 8.66,
    y: 2.12,
    w: 1.1,
    h: 0.18,
    fontSize: 9.4,
    bold: true,
    color: COLORS.red,
  });
  addDecisionRows(slide, [
    ["读压力", "LIST/WATCH 飙升", "读缓存、APF、热点路径削峰", "再判断 etcd replacement"],
    ["写压力", "Events / status 抖动", "拆 Events、控频、缩小对象", "再判断是不是 operator 设计问题"],
    ["调度吞吐", "批量 admission 堵塞", "queue + partition + hierarchy", "再考虑多 scheduler / 多集群"],
    ["网络/IP", "CIDR、DNS、跨区延迟", "先修网络模型和拓扑", "再判断是否拆 cluster cell"],
    ["组织自治", "版本 / CRD 冲突", "vCluster / dedicated cluster", "再引入 federation 管理层"],
  ]);
  finalize(slide, pptx);

  slide = pptx.addSlide();
  addChrome(slide, 13, "Roadmap");
  addTitle(
    slide,
    "RECOMMENDED EXECUTION ORDER",
    "先做诊断，再做架构选择",
    "这不是纯理论问题。没有压测、没有 operator 画像、没有拓扑数据时，“拆不拆集群”只是猜。"
  );
  addCard(slide, {
    x: 0.9,
    y: 2.7,
    w: 2.2,
    h: 2.45,
    titleValue: "01 Measure",
    accent: COLORS.red,
    body: [
      "做 control plane、scheduler、operator、network 全链路画像",
      "区分 object 数、tenant 数、pod churn、node 数",
    ],
  });
  addCard(slide, {
    x: 3.3,
    y: 2.7,
    w: 2.2,
    h: 2.45,
    titleValue: "02 Fix First",
    accent: COLORS.orange,
    body: [
      "先修最硬的技术瓶颈",
      "把 upstream 已经解决的问题先吃满",
    ],
  });
  addCard(slide, {
    x: 5.7,
    y: 2.7,
    w: 2.2,
    h: 2.45,
    titleValue: "03 Partition",
    accent: COLORS.teal,
    body: [
      "通过 node pool、queue、vCluster 或 cell 做最小必要拆分",
      "避免一次跳到 fleet 级复杂度",
    ],
  });
  addCard(slide, {
    x: 8.1,
    y: 2.7,
    w: 2.2,
    h: 2.45,
    titleValue: "04 Federate",
    accent: COLORS.green,
    body: [
      "确实需要多集群时，再引入 KubeAdmiral / MultiKueue 等治理层",
      "把 fleet 管理当成新平台工程",
    ],
  });
  addCard(slide, {
    x: 10.5,
    y: 2.7,
    w: 2.2,
    h: 2.45,
    titleValue: "05 Re-test",
    accent: COLORS.blue,
    body: [
      "重新压测并检查 blast radius",
      "确认你解决的是主瓶颈，不是换了个形态继续放大",
    ],
  });
  finalize(slide, pptx);

  slide = pptx.addSlide();
  addChrome(slide, 14, "Sources");
  addTitle(
    slide,
    "THANK YOU",
    "核心结论：先识别瓶颈，再决定单大集群、多集群还是中间态",
    "这份更新版 deck 主要基于本地 AI-Infra 仓库中与大规模集群、多租户、调度和案例分析相关的内容整理。"
  );
  addCard(slide, {
    x: 0.94,
    y: 2.68,
    w: 5.35,
    h: 2.84,
    titleValue: "本次主要引用的 AI-Infra 内容",
    accent: COLORS.red,
    body: [
      "docs/kubernetes/large-scale-clusters.md",
      "docs/kubernetes/scheduling-optimization.md",
      "docs/blog/2026-03-13/bayer-gke-15000-nodes_zh.md",
      "docs/blog/2025-12-15/bytedance-large-scale-k8s_zh.md",
      "docs/blog/2025-12-15/multi-tenancy-isolation_zh.md",
      "docs/blog/2025-12-01/aws-10k-node-clusters_zh.md",
    ],
    bodySize: 9.7,
  });
  addCard(slide, {
    x: 6.66,
    y: 2.68,
    w: 5.72,
    h: 2.84,
    titleValue: "建议带走的三句话",
    accent: COLORS.teal,
    body: [
      "节点数不是唯一尺度，对象数、watch 数和租户数往往更关键。",
      "多集群不是性能优化按钮，而是治理边界重构。",
      "vCluster、cell、queue partitioning 是比“全拆”更现实的中间态。",
    ],
    bodySize: 10.1,
  });
  text(slide, "Repo: github.com/pacoxu/AI-Infra", {
    x: 0.98,
    y: 5.92,
    w: 3.4,
    h: 0.2,
    fontFace: FONT_HEAD,
    fontSize: 10,
    bold: true,
    color: COLORS.red,
  });
  text(slide, "Huge Cluster or Multi-Clusters? Keep the bottleneck visible.", {
    x: 6.7,
    y: 5.92,
    w: 5.0,
    h: 0.2,
    fontFace: FONT_HEAD,
    fontSize: 10,
    color: COLORS.muted,
    align: "right",
  });
  finalize(slide, pptx);

  await pptx.writeFile({ fileName: OUT_FILE });
  console.log(`Wrote ${OUT_FILE}`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
