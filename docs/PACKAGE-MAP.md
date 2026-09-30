# Package Map / 打包说明

## Original Sources / 原创源码

| File / 文件 | Role / 作用 | Deployment status / 部署状态 |
| --- | --- | --- |
| [private-links.cjs](../src/private-links.cjs) | Process-local link routing / 进程内链接适配 | Original locally tested module; installer required / 原模块，需接入应用 |
| [ClaudeGuardWfp.cs](../src/ClaudeGuardWfp.cs) | WFP API wrapper / 网络过滤封装 | x64 Windows, elevated writes; static Verify has limited coverage / 管理员写入，检查范围有限 |
| [NetworkProbe.cs](../src/NetworkProbe.cs) | TCP/UDP probe / 网络探针 | Compile locally; UDP send success is not delivery / 本地编译，以接收端验证 UDP |
| [guarded-mcp.cjs](../src/guarded-mcp.cjs) | Stdio allowlist / 工具白名单 | Expects separate Node/MCP install layout / 需独立运行目录 |
| [audit.cjs](../scripts/audit.cjs) | Read-only static audit / 只读审计 | Ready to run with private paths / 可用本地配置运行 |
| [release-check.cjs](../scripts/release-check.cjs) | Publication hygiene / 公开包检查 | Heuristic, not comprehensive / 启发式检查非穷尽 |

## Reference Implementation / 历史实施参考

All files below end in `.example` intentionally. Paths are replaced with `C:/Example` or equivalent Windows separators; the real exit address is replaced with `[REDACTED_EXIT_IP]`. These are explanatory snapshots, not valid deployment configuration. Renaming them is not sufficient to make them safe. / 仅改扩展名不代表可安全运行，必须逐项适配和审核。

| Reference / 参考文件 | Responsibility / 职责 |
| --- | --- |
| [Configure-PrivateEdge.ps1.example](../reference/Configure-PrivateEdge.ps1.example) | Register private executable rules and shortcut / 专用程序规则与快捷方式 |
| [Start-Proxy.ps1.example](../reference/Start-Proxy.ps1.example) | Verify proxy hashes/rules before hidden launch / 代理校验启动 |
| [Launch-ClaudeGuard.ps1.example](../reference/Launch-ClaudeGuard.ps1.example) | Historical guarded-launch preflight; direct shortcuts bypass this per-launch step / 历史启动预检，直开快捷方式会跳过 |
| [Test-FixedExit.ps1.example](../reference/Test-FixedExit.ps1.example) | Fixed-exit helper / 固定出口辅助逻辑 |
| [Block-ClaudeBrowserBridge.ps1.example](../reference/Block-ClaudeBrowserBridge.ps1.example) | Historical extension/native-host policy changes / 历史扩展与宿主策略 |
| [Verify-Network.ps1.example](../reference/Verify-Network.ps1.example) | TCP/UDP/IPv6/outage controlled tests / 网络对照实验 |
| [Verify-Dns.ps1.example](../reference/Verify-Dns.ps1.example) | Unique DNS trace with positive baseline / DNS 阳性对照 |
| [Test-PrivateEdge.cjs.example](../reference/Test-PrivateEdge.cjs.example) | Actual-browser egress/ICE/negative tests / 浏览器行为测试 |
| [Test-PrivateEdgeMcp.cjs.example](../reference/Test-PrivateEdgeMcp.cjs.example) | MCP protocol and browser integration tests / MCP 集成测试 |
| [Install-PrivateLinks.cjs.example](../reference/Install-PrivateLinks.cjs.example) | Backup, package patch, digest update / 备份、补丁和摘要更新 |
| [Rollback-ClaudePrivateLinks.ps1.example](../reference/Rollback-ClaudePrivateLinks.ps1.example) | Hash-checked rollback / 哈希校验回滚 |
| [Snapshot-PrivateLinks.ps1.example](../reference/Snapshot-PrivateLinks.ps1.example) | Before/after defaults/process snapshot / 默认关联和进程快照 |
| [Verify-PrivateLinks.cjs.example](../reference/Verify-PrivateLinks.cjs.example) | Compare patch/runtime/rollback evidence / 补丁运行与回滚证据核对 |

Historical bug to fix before reusing the browser setup reference: its PowerShell argument-array concatenation produced a single combined manifest string. The historical shortcut worked, but that array must not be forwarded as one Node `spawn` argument. The adapter source constructs a real argument list independently. / 浏览器设置参考脚本的参数数组拼接曾使清单形成单一字符串；复用前必须修正，不能作为 Node 的单个参数传入。

The browser-extension/native-host policies are scoped by user and browser, not by the Claude process alone. They were earlier historical restrictions on Claude integration within daily browsers. The later external-link adapter does not add or change those policies. / 扩展限制是用户级浏览器策略，并非进程内限制；“只影响 Claude 外部网页入口”的表述不能扩展到全部历史策略。

## Documented Manual Changes / 文档化的手工改动

Not every historical action was a standalone script. The guide/checklist also capture feature flags, proxy egress policy, direct desktop shortcuts, proxy-only logon task, sandbox ACL repair, copying signed local runtimes, MCP config merge, and post-update rule maintenance. / 未独立成脚本的操作也在指南和清单中记录。

Relevant historical Claude policy names: `egressProxyUrl`, `secureVmFeaturesEnabled`, `isClaudeCodeForDesktopEnabled`, `isDesktopExtensionEnabled`, `isDesktopExtensionDirectoryEnabled`, `isLocalDevMcpEnabled`, and `disableAutoUpdates`. They are version-specific observations, not a universal configuration contract. The current public package does not apply them. / 这些是版本特定观察，本包不会自动写入。

## Intentionally Excluded / 明确不打包

Claude/Edge/Node/proxy EXEs and DLLs; patched or original app.asar; user profiles; cookies; credentials; OAuth URLs; live proxy YAML/subscriptions; raw app/MCP/DNS logs; account screenshots; private backup archives; real exit IP; usernames, machine identifiers, local absolute paths, and private hashes of credential-bearing configuration. / 上述内容不属于公开包，保留在原本机，不因整理而删除。

There is no Browser Tamer binary/source in this package because that alternative was not used. / 没有实际使用的全局分流器，因此不会虚构一个分流器安装包。
