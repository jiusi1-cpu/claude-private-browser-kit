# Security Model / 安全模型

## Protected Scope / 保护范围

The intended controls separate browser data, route selected desktop web links, and constrain explicitly registered executable paths. They do not defend against an administrator, arbitrary code running as the same user, a malicious privileged MCP, a compromised proxy, or every future executable introduced by an update. / 控制范围是浏览器资料、桌面网页入口和已登记的程序路径，不对抗管理员、同用户任意代码、恶意高权限 MCP、失陷代理或所有未来更新路径。

The same user can generally read files accessible to that user. A private profile is not a separate security principal. / 独立 Profile 不是独立安全主体。

## Important Risks / 重要风险

- Application patching changes executable trust. ASAR digest consistency is not Authenticode validity. / 应用包摘要一致不等于厂商签名有效。
- Reference installers can affect firewall policy and app files when adapted; they are not safe default entry points. / 参考脚本适配后有实质系统影响。
- The MCP allowlist retains browser evaluation, navigation, typing, forms, and dialogs. It is not an exfiltration prevention layer or a URL allowlist. / MCP 白名单不是防外传层或目标 URL 白名单。
- Browser tools and original app logging may retain URLs, page data, and screenshots even though this adapter does not log them. / 适配器不记 URL，不代表其他组件也不记。
- A loopback proxy endpoint is a local trust dependency; verify its executable and configuration, not only the port. / 回环代理也是信任依赖，不能只看端口。
- `ClaudeGuardWfp.Verify` does not compare all filter condition values. Present rules must still undergo actual traffic tests. / 存在性检查不能替代流量测试。
- WFP paths do not constrain a model's abstract intent or every child process. Rules must be refreshed for new executable paths. / 路径规则不自动覆盖新子进程。
- Browser copies need security updates; disabled automatic application updates create a maintenance obligation, not a permanent safe state. / 更新冻结会带来维护责任。
- No regional eligibility, account health, legal compliance, or anti-ban guarantee is made. / 不承诺地区资格、账号安全或不封号。

## Safe Reporting / 安全报告

Do not post tokens, passwords, browser databases, proxy subscriptions, raw DNS/packet traces, auth URLs, or unredacted logs in public issues. Use synthetic URLs and minimal aggregate evidence. / 不要在公开 Issue 中贴凭据、浏览器数据库、订阅、原始抓包或授权链接。

The repository owner and private security contact are not set because this package has not been published. Before publication, configure a real private reporting channel. Until then, do not invent a contact or send vulnerability details to an unrelated project. / 发布前由仓库所有者设置真实私密报告渠道，目前没有虚构联系方式。

On failure, stop the affected workflow and use validated backups. Do not disable certificate validation, sandboxing, or integrity checks to make a test appear successful. / 遇到失败应停止相关流程并恢复，不关闭证书、沙箱或完整性校验来凑通过。
