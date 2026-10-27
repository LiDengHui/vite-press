---
title: 常用AI技能
date: 2026-10-27
tags:
  - AI
  - Agent Skills
  - 前端
  - 全栈
  - 工具
  - 效率
categories:
  - 技术文档
  - 前端
  - AI
  - 工具
---

# 常用 AI Skills 目录（前端全栈）

[[toc]]

> Skill 不是模型，而是一份可被 Agent 加载的 `SKILL.md` 工作流：它把某类任务的做法、检查清单和脚本固定下来。适用于 Claude Code、Codex、Cursor、Kimi Code 等支持 Agent Skills 的工具。

建议先装 **1 个编码行为准则 + 1 个设计方向 + 1 个测试/评审**，再按需增加。不要一次安装多个定位重叠的设计 Skill，容易互相冲突。

## 安装与使用

最通用的方式是 Vercel Labs 的 skills CLI：

```bash
# 搜索
npx skills find react

# 安装一个仓库或指定 skill
npx skills add vercel-labs/agent-skills --skill web-design-guidelines

# 查看已安装
npx skills list
```

也可以直接在 Claude Code 里使用插件市场：

```text
/plugin marketplace add anthropics/skills
/plugin install superpowers@claude-plugins-official
```

Kimi Code 的项目级 Skill 目录是 `.kimi-code/skills/`，用户级目录是 `~/.kimi-code/skills/`。团队规范建议放项目级，个人偏好放用户级。

## 一、通用编码与工作流

| Skill | 作用 | 适合场景 | 入口 |
| --- | --- | --- | --- |
| **andrej-karpathy-skills** | 把 Karpathy 对 LLM 编码的观察固化成行为准则：先暴露假设、优先简单方案、做外科手术式修改、先定义可验证的成功标准 | 日常写代码、改 bug、让 Agent 少自作主张 | [GitHub](https://github.com/multica-ai/andrej-karpathy-skills) |
| **Superpowers** | Jesse Vincent 的 Agent Skills 框架，覆盖 brainstorming、写计划、TDD、系统化调试、代码评审、git worktree 等流程 | 需要让 Agent 按完整工程流程推进功能 | [GitHub](https://github.com/obra/superpowers) |
| **Find Skills** | skills CLI 自带的发现能力，用关键词搜索并安装社区 Skill | 不知道装什么、想先找现成方案 | [GitHub](https://github.com/vercel-labs/skills) |
| **Skill Creator** | Anthropic 官方元 Skill，帮助把团队流程、代码规范写成新的 `SKILL.md` | 团队有固定规范，想沉淀成可复用 Skill | [GitHub](https://github.com/anthropics/skills/tree/main/skills/skill-creator) |

> Karpathy 相关 Skill 是社区根据其公开观点整理的，不是 Andrej Karpathy 官方发布的插件。

## 二、前端与 UI/UX

| Skill | 作用 | 适合场景 | 入口 |
| --- | --- | --- | --- |
| **Frontend Design** | Anthropic 官方前端设计 Skill，强调有意图的视觉方向、排版、层次和非模板化 UI | 新页面、改版、让界面不像 AI 默认模板 | [GitHub](https://github.com/anthropics/skills/tree/main/skills/frontend-design) |
| **Impeccable** | Paul Bakaus 的设计语言与审查工具，含 `audit`、`critique`、`polish` 等命令和反 AI-slop 检查 | 页面能用但不好看，需要系统审查和打磨 | [GitHub](https://github.com/pbakaus/impeccable) |
| **UI UX Pro Max** | 可搜索的 UI/UX 设计知识库，给出风格、配色、字体、技术栈建议 | 从零开始做产品，需要先定设计系统 | [GitHub](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) |
| **Taste Skill** | 强调 art direction、参考图和浏览器检查，减少模板化页面 | 需要更强的视觉判断和方向感 | [GitHub](https://github.com/Leonxlnx/taste-skill) |
| **Emil Kowalski Skills** | 动画与交互设计工程经验，覆盖时长、缓动、组件手感、动效审查 | 微交互、转场、组件动画、设计工程细节 | [GitHub](https://github.com/emilkowalski/skills) |
| **Vercel Web Design Guidelines** | 按 Web Interface Guidelines 检查可访问性、性能和 UX，输出 `file:line` 级问题 | 上线前 UI 审查、可访问性检查 | [GitHub](https://github.com/vercel-labs/agent-skills) |
| **Frontend Skills Stack** | 把 Anthropic Frontend Design、Impeccable、UI UX Pro Max、Taste、Emil 等打包并做冲突路由 | 想一次装齐前端设计能力，接受较多依赖 | [GitHub](https://github.com/JaimeJunr/claude-code-frontend-skills) |

## 三、全栈与工程化

| Skill | 作用 | 适合场景 | 入口 |
| --- | --- | --- | --- |
| **Fullstack Claude Skill Pack** | 34 个偏生产环境的全栈 Skill：认证、API 设计、React、Docker、CI/CD、测试等，偏 MERN + TypeScript | 从零搭全栈项目或补齐工程化环节 | [GitHub](https://github.com/iamzaheershaik/fullstack-claude-skill-pack) |
| **Vercel Agent Skills** | React 最佳实践、组件组合模式、浏览器自动化、Web 设计审查等 | React/Next.js 项目、性能与组件架构 | [GitHub](https://github.com/vercel-labs/agent-skills) |
| **MCP Builder** | 指导构建 MCP Server，把内部 API、数据库和工具接入 Agent | 需要让 Agent 调公司内部系统 | [GitHub](https://github.com/anthropics/skills/tree/main/skills/mcp-builder) |
| **Web Artifacts Builder** | 快速构建可交互的 Web 产物，适合做演示、原型和内部工具 | 原型、dashboard、演示页面 | [GitHub](https://github.com/anthropics/skills/tree/main/skills/web-artifacts-builder) |

## 四、测试、评审与质量

| Skill | 作用 | 适合场景 | 入口 |
| --- | --- | --- | --- |
| **Webapp Testing** | 用浏览器驱动真实应用，做端到端验证、截图和交互检查 | 改完 UI 后验证真实页面，而不是只看代码 | [GitHub](https://github.com/anthropics/skills/tree/main/skills/webapp-testing) |
| **Code Review** | 按审查清单检查变更，输出阻塞项和风险点 | 提交 PR 前自审、让 Agent 做第一轮 review | [GitHub](https://github.com/vercel-labs/agent-skills) |
| **Systematic Debugging** | Superpowers 中的系统化调试流程：先形成假设，再收集证据、逐项排除 | 复杂 bug、偶现问题、不要一上来就猜 | [GitHub](https://github.com/obra/superpowers) |

## 五、文档与交付

| Skill | 作用 | 适合场景 | 入口 |
| --- | --- | --- | --- |
| **Document Skills** | Anthropic 官方的 `docx`、`pdf`、`pptx`、`xlsx`、`doc-coauthoring` 等文档处理能力 | 需求文档、方案、汇报材料、表格 | [GitHub](https://github.com/anthropics/skills) |
| **Brand Guidelines / Theme Factory** | 把品牌色、字体、组件规范固化成 Agent 可执行的设计约束 | 多页面/多产品保持视觉一致 | [GitHub](https://github.com/anthropics/skills) |

## 六、技能发现与学习

| 资源 | 作用 | 入口 |
| --- | --- | --- |
| **skills.sh** | Agent Skills 目录与排行榜，可按安装量、分类浏览 | [skills.sh](https://skills.sh) |
| **VoltAgent Awesome Agent Skills** | 1000+ 社区 Skill 的精选索引 | [GitHub](https://github.com/VoltAgent/awesome-agent-skills) |
| **heilcheng Awesome Agent Skills** | 教程、指南和目录，适合了解 Skill 生态 | [GitHub](https://github.com/heilcheng/awesome-agent-skills) |
| **Karpathy RSS Daily Briefing** | 抓取 Karpathy 精选 RSS，生成 AI/技术日报，偏学习资讯 | [GitHub](https://github.com/psylch/karpathy-rss-daily-briefing-skill) |

## 按任务选型

| 任务 | 首选 | 备选 |
| --- | --- | --- |
| 日常写代码、改 bug | Karpathy Guidelines | Superpowers |
| 新页面、改版、视觉方向 | Frontend Design | UI UX Pro Max、Taste |
| 页面能用但不够精致 | Impeccable | Emil Kowalski Skills |
| 动画、微交互、组件手感 | Emil Kowalski Skills | Impeccable |
| UI 可访问性/规范审查 | Vercel Web Design Guidelines | Impeccable `audit` |
| 全栈项目脚手架 | Fullstack Claude Skill Pack | Vercel Agent Skills |
| 端到端验证 | Webapp Testing | Playwright / 浏览器自动化 |
| 团队规范沉淀 | Skill Creator | 自建 `SKILL.md` |
| 找新 Skill | Find Skills + skills.sh | Awesome Agent Skills |

## 使用建议与安全

1. **先看 `SKILL.md` 和脚本**：Skill 可能包含 shell 命令、网络请求和 hooks，安装前至少读一遍入口文件。
2. **优先项目级安装**：团队规范放项目的 `.agents/skills/` 或 `.kimi-code/skills/`，不要把所有全局偏好塞进每个项目。
3. **控制重叠**：Frontend Design、Impeccable、UI UX Pro Max、Taste 都在解决“设计品味”，同时装多个时最好用一套路由/冲突规则，或只保留一个主方向。
4. **固定版本**：对生产项目锁定 commit 或版本，避免上游 Skill 更新后行为突变。
5. **注意网络行为**：部分 Skill 会在运行时拉取远程指南或执行脚本，先确认来源和权限。
6. **不要把密钥写进 Skill**：Token、数据库密码和内部地址放在环境变量或密钥管理里。

## 参考目录

- [Anthropic Skills（官方）](https://github.com/anthropics/skills)
- [Vercel Labs Skills CLI](https://github.com/vercel-labs/skills)
- [skills.sh 目录](https://skills.sh)
- [Superpowers](https://github.com/obra/superpowers)
- [Impeccable](https://github.com/pbakaus/impeccable)
