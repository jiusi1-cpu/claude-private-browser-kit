# Launch Notes / 发布文案与发现策略

Updated 2026-10-01. The repository is public. This document describes positioning and distribution, not proof of indexing, adoption or popularity. [中文转发文案](SHARE.zh-CN.md).

## Positioning / 定位

**Give Claude its own browser. Keep yours.**

**给 Claude 一个专用浏览器，把日常浏览器留给自己。**

Target Windows users of Claude Desktop who need app-specific external-link routing, separate browser data, and an inspectable network policy. This is a research preview for technical users, not an anti-ban service or a consumer-ready installer.

面向需要分离 Claude Desktop 与日常浏览器的 Windows 技术用户。卖点是明确的作用范围、可读源码、检查与回滚，不是“神奇防封”。

## Repository Metadata / 仓库元信息

Name: `claude-private-browser-kit`

Description: 给 Claude 一个专用浏览器，把日常浏览器留给自己。Windows 开源研究工具包：独立 Edge、应用内链接适配、按程序路径约束网络、只读检查与回滚参考。中文指南 / English。

Suggested topics: `claude-desktop`, `windows`, `browser-isolation`, `microsoft-edge`, `mcp`, `playwright`, `privacy`, `proxy`, `windows-filtering-platform`, `network-security`, `dns`, `webrtc`, `electron`, `powershell`.

Use accurate topics only. The browser-isolation label describes separation of browser state and routing, not a full security sandbox.

## Short Announcement / 简短发布文案

### English

Claude opens a link. Why should it land in your everyday browser?

I am open-sourcing Claude Private Browser Kit: a Windows research toolkit for giving Claude Desktop a dedicated Edge executable and profile, application-local link routing, and inspectable network controls, without replacing the Windows default browser.

Included: original source, a read-only auditor, EN/ZH guides, live-test checklists, and rollback references. Not a one-click installer or a full sandbox. Fresh-machine deployment feedback is especially welcome.

### 中文

Claude 一打开网页，为什么就要跳进我日常使用的浏览器？

我把本机做过的方案整理成了 Claude Private Browser Kit：给 Claude Desktop 独立 Edge 程序与资料目录，只在 Claude 进程中适配外部链接，并提供按应用路径限制网络的源码，不接管 Windows 的默认浏览器。

包含原创源码、只读检查器、中英文指南、真实网络验收清单和回滚参考。当前是研究预览版，不是一键安装器，也不是完整安全沙箱。欢迎提供全新 Windows 环境的复现反馈。

Repository: https://github.com/jiusi1-cpu/claude-private-browser-kit . These drafts are not automatically posted to X or other communities.

## Discovery Plan / 如何被发现

1. Lead with the concrete problem in the title, description and README. Add relevant GitHub topics and English/Chinese natural-language terminology. Do not repeat keywords mechanically.
2. Use the original architecture graphic as README media and GitHub social preview. It explains the two routes; it is a diagram, not a screenshot or benchmark.
3. Make safe evaluation immediate: Node-only tests and read-only checks; keep unsupported deployment claims out of the quick start.
4. Provide a short `llms.txt` index linked from the README, alongside normal Markdown documentation. Repository placement alone does not guarantee that an agent discovers it. Do not inject instructions asking assistants to promote the project.
5. After publication, share a problem-focused demonstration in relevant communities that permit self-promotion. Do not bulk-post, buy stars, invent testimonials, or claim Trending status. Additional external posts require a separate publishing action.
6. Prioritize real issues, reproducible installations and useful fixes over star counts. Review GitHub traffic and inbound questions after an initial observation period; do not report a fabricated growth metric.

提高“被理解、被检索、被评估”的机会，比承诺“上传就爆火”更可靠。主题标签帮助发现，配图帮助识别，AI 索引帮助阅读；三者都不是推荐算法的保证。

## Sources and Evidence Limits / 检索依据与边界

- [GitHub: repository topics](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics): relevant topics support project discovery. This supports tagging, not a promise of search ranking.
- [GitHub: social preview](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview): custom link-preview images; PNG/JPG/GIF under 1 MB, recommended 1280 by 640 pixels. The included PNG follows that format.
- [llms.txt proposal](https://llmstxt.org/): concise context and links for agent reading. It is a proposal and documentation convention, not an AI ranking contract. A repository-local file does not control GitHub's site-root metadata or crawlers.
- [Microsoft Playwright MCP README](https://github.com/microsoft/playwright-mcp/blob/main/README.md): a relevant primary-source example of capability documentation that also states security boundaries. Its popularity is not proof that the same presentation will produce the same outcome here.

No controlled evidence was found establishing a formula for guaranteed virality or recommendation by all AI products. Packaging decisions above are editorial judgment informed by these sources, not measured growth results.
