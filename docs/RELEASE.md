# Release Gate / 发布门禁

This directory is prepared for later GitHub publication. No repository has been created, no code pushed, and no external submission authorized by this preparation alone. / 当前仅整理，尚未建仓库、推送或发布。

## Prepared / 已准备

- [x] English and Simplified Chinese entry documents and complete guides. / 中英文入口与完整指南。
- [x] Bilingual audit checklist, security boundaries, X review, and local-case evidence. / 双语检查、安全边界、研究与证据。
- [x] Original source modules plus redacted inert implementation references. / 原创模块与脱敏参考脚本。
- [x] Read-only environment checker and source-package hygiene checker. / 只读环境与公开包检查。
- [x] Test commands and a GitHub Actions workflow, without integration deployment. / 测试命令与 CI 定义，不在 CI 里修改系统网络。
- [x] Draft MIT licensing for original material; separate third-party notices. / 原创材料 MIT 许可准备及第三方说明。
- [x] `.gitignore` prevents common private runtime artifacts from accidental Git inclusion. / 忽略常见私有产物，但不将其当成完整防泄漏机制。

## Required Before Publication / 发布前必须确认

- [ ] Owner chooses repository/account/name and public visibility. / 确认账号、仓库名和公开可见性。
- [ ] Owner approves license and attribution; review third-party redistribution boundaries. / 确认许可和署名及分发边界。
- [ ] Review ZIP entries and final hashes after all changes. / 最终修改后复核压缩包与哈希。
- [ ] Run tests and source checks on the exact tree to be pushed. / 对实际发布树运行检查。
- [ ] Configure a genuine private security reporting contact. / 设置真实私密安全报告渠道。
- [ ] Retain the research-preview label and explicit unverified areas. / 保留研究预览与未验证说明。
- [ ] Obtain explicit approval for GitHub creation/push. / 获得具体外部发布授权。

## Required Before Claiming General Deployment Support / 宣称通用部署前

- [ ] Fresh Windows VM installation test with rollback, not merely source syntax checks. / 新机器完整安装和回滚。
- [ ] Version/hash-gated installer replacing inert reference examples. / 具备版本门禁的正式安装器。
- [ ] Full WFP predicate audit and meaningful traffic positive/negative controls. / 完整规则条件与流量对照。
- [ ] User-completed login callback and authenticated model/MCP/Code/Cowork acceptance. / 真实登录与工作流验收。
- [ ] Browser/runtime update procedure and new-path fail-closed handling. / 更新与新路径维护。
- [ ] Independent review of MCP target restrictions, filesystem permissions, logging and data egress. / 独立审查目标限制、文件权限与外传。

GitHub Actions has only been authored here; its cloud execution is unverified until the repository exists and a workflow run finishes. / 这里只编写了 CI，未声称云端运行成功。

## Suggested Description / 建议仓库简介

> Windows app-scoped browser routing and network-isolation reference toolkit, with bilingual audit checklists and explicit evidence limits.

> Windows 应用级浏览器路由与网络隔离参考工具包，包含双语检查清单、回滚逻辑和明确的证据边界。

Do not market this as an official Claude project, a universal installer, a country-detection bypass, or a no-ban guarantee. / 不以官方项目、通用安装器、地区隐身或不封号保证宣传。
