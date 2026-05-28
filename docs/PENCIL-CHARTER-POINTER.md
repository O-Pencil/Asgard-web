# Pencil 生态发展路线 — Charter Pointer

> **生态发展路线唯一源头**：[nanoPencil/docs/pencil-platform-charter.md](https://github.com/O-Pencil/nanoPencil/blob/main/docs/pencil-platform-charter.md)
>
> 本文是 **Asgard-web** 在 Pencil 生态中的 pointer 文档。所有生态级事实以 charter 为准；本文只描述 Asgard-web 本仓的角色 + 边界 + 跨项目事实查表入口。

## 1. 本仓在 Pencil 生态中的位置

Asgard-web 是 **Asgard Platform 的前端**，是 Pencil 生态 4 项目中 Asgard Platform 的 **Web UI 实现层**（charter §3 / §4）。

技术栈：React + Vite + TailwindCSS。

**所属 monorepo**：`O-Pencil/Asgard-platform`（作为 `packages/web` 子模块）。

**与 nanopencil-editor 的边界**：Asgard-web 主导**多 Agent 管理 UI**（Marketplace / Console / Soul-Memory 配置），**不**复刻 editor 的写作 UI；editor 主导**写作客户端 UI**，**不**复刻 Asgard 的 PencilAgent 创建/编辑 UI（charter §3 责任边界）。

## 2. 本仓在 charter §7 各工作线中的角色

charter §7 列出阶段四的 6 条工作线。Asgard-web 直接承载其中：

| 工作线 | 是否承载 | 备注 |
|---|---|---|
| A 工具回传 v0.2 | ⚪ 不参与 | editor + Gateway + nano-pencil 主导 |
| B 计费与用量闭环 | ✅ 配套 UI | 用量看板、配额提示；接口由 Asgard-api 提供 |
| C 容器隔离与编排 | ⚪ 不参与 | 透明（不感知容器拓扑） |
| **D Soul/Memory 配置 UI** | ✅ **主导** | PencilAgent 的 Soul 编辑 / Memory 浏览 / 个性化配置入口 |
| E Channel 拆仓 | ⚪ 不参与 | — |
| F Rust 性能层 | ⚪ 不参与 | — |

详细里程碑见 charter §7.4。

## 3. 跨项目事实查表入口

| 想找什么 | 去 charter 哪一节 |
|---|---|
| 4 项目拓扑与依赖关系 | §2 |
| 各项目责任边界（含 Asgard vs editor 划分） | §3 |
| 术语表（PencilAgent / Pencil / Soul 等） | §4 |
| 协议策略 | §5 |
| 阶段叙事（一→四） | §6 |
| 跨项目工作线 / 里程碑 | §7 |
| 跨项目决策记录 | §8 |
| 文档维护机制 | §10 |

## 4. charter 失同步时怎么办

发现 charter 跟实际不符时，**不要修改本仓 pointer**，而是按 charter §10.1 流程：

1. 直接在 `O-Pencil/nanoPencil` 仓库提 PR 改 charter（源头修），或开 issue 说明问题
2. charter 改动会通过 `nanoPencil/.github/workflows/charter-sync-notify.yml` 自动通知本仓
3. 收到 charter-sync issue 后，本仓再决定是否需要刷新本 pointer

**本仓 pointer 只在以下情况修改**：
- charter §3 关于 Asgard 责任边界、Asgard vs editor 划分的描述变化
- §7 工作线 B / D 里 Asgard-web 承载范围的变化

详见 charter §10.1（修改流程）、§10.2（防止重复）、§10.3（同步检测自动化）。
