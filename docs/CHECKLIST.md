# Audit Checklist / 检查清单

[中文指南](GUIDE.zh-CN.md) · [English guide](GUIDE.en.md)

Record **PASS / FAIL / UNVERIFIED** for each item. An unchecked box is not a pass. This is a fresh-run checklist, not a copy of the historical case results. / 每项记录通过、失败或未验证，未勾选不等于通过。本表用于新的检查，不预填本机历史 PASS。

Evidence should be a minimal redacted observation, test configuration/version, time, and recovery outcome. Do not attach raw logs, cookies, authorization URLs, credentials, or DNS traces. / 只保留最小化脱敏观察、版本、时间和恢复结果，不上传原始敏感资料。

## P0: Scope and Recovery / 范围与恢复

- [ ] Record Windows/browser/Claude/Node/MCP versions and exact private local paths. / 记录版本和私有本机路径。
- [ ] Confirm account/network authorization separately; no anti-ban or eligibility guarantee. / 服务资格独立确认，不作防封承诺。
- [ ] Save HTTP/HTTPS UserChoice and callback command baseline privately. / 私下备份默认关联和回调命令。
- [ ] Back up changed EXE, ASAR, config, policies, ACLs, shortcuts, and rule inventory as applicable. / 按改动范围备份程序、配置、策略、ACL、快捷方式和规则。
- [ ] Verify backup hashes before changes. / 改动前校验备份哈希。
- [ ] Keep daily browser processes/profiles and unrelated services untouched. / 保留日常浏览器和无关服务。
- [ ] Do not modify system time zone. / 本方案不改系统时区。
- [ ] Prepare restoration commands; refuse rollback over subsequent unrelated edits. / 准备恢复，拒绝覆盖后续无关修改。

## P1: Browser Separation / 浏览器分离

- [ ] Private executable is a real copy, not the daily executable or a hard/symbolic link. / 独立程序是真实副本。
- [ ] Profile is distinct and initially empty; no daily-data import or account sync. / 独立空资料目录，不导入日常数据。
- [ ] Source/copy signatures and hashes are recorded; update responsibility assigned. / 核对签名哈希并明确更新责任。
- [ ] Chromium sandbox works; application-directory read/execute ACL only, no profile-wide grants. / 沙箱有效，仅必要程序目录权限。
- [ ] Actual process has expected executable, profile, and proxy flags. / 核对实际进程，而不只检查快捷方式文字。
- [ ] Same-user filesystem/OS fingerprint limitations are documented. / 说明同用户与系统特征仍共享。

## P1: Network Enforcement / 网络约束

- [ ] Enumerate browser main/helper executables, Claude, proxy, Node, and relevant children. / 枚举主程序、辅助程序和相关子进程。
- [ ] Install/review only intended path rules; audit condition values separately from `Verify`. / 按路径限制，另审具体条件值。
- [ ] Exact loopback TCP proxy succeeds with a live listener. / 指定 TCP 回环端点阳性通过。
- [ ] Alternate local endpoint and direct public TCP fail with a known working baseline. / 其他本地端点和公网直连被阻断，需有阳性对照。
- [ ] UDP receiver gets the unprotected probe but not the protected probe. / UDP 以接收端证明阻断，不以 send 返回值证明。
- [ ] IPv6 test has a meaningful baseline; distinguish missing connectivity from policy denial. / IPv6 区分无连通性和策略拒绝。
- [ ] Deliberate proxy outage causes failure, not direct fallback; restore in `finally` and verify recovery. / 代理故障不直连，最终恢复并复验。
- [ ] Repeat egress observation after reconnect/restart; do not infer permanent stability from one sample. / 重连重启后复测，不由单次结果推长期固定。
- [ ] Check proxy/helper upstream path too, not only the browser-to-loopback hop. / 同时检查代理和上游链路。

## P1: DNS and WebRTC / DNS 与 WebRTC

- [ ] Use fresh unique target hostname to reduce cache ambiguity. / 使用新域名降低缓存干扰。
- [ ] Start a uniquely named DNS event session and prove a positive resolver baseline. / 独立跟踪会话，先证明可观测到系统解析。
- [ ] Navigate through the actual protected browser; require a meaningful response, not merely zero events. / 实际浏览器访问获得有效响应，不能只看零事件。
- [ ] No local DNS event for the fresh proxied target under that test; separately audit upstream DNS. / 该实验中目标域名无本地事件，上游解析另查。
- [ ] Stop only the created trace session and remove its raw trace securely after aggregate extraction. / 只关闭自己创建的会话，提取摘要后移除原始跟踪。
- [ ] Inspect WebRTC ICE candidates under a stated STUN configuration and observation window. / 记录 STUN 条件与等待时长后观察 ICE。
- [ ] State that no candidates in this experiment does not remove the WebRTC API. / 不把候选为空写成 API 已关闭。

## P1: External Links / 外部链接

- [ ] Verify input archive/executable version and hashes before patching; unsupported versions stop. / 补丁前核对版本和哈希。
- [ ] ASAR entries and embedded header digest match; security fuse bytes unchanged. / 摘要一致，安全 fuse 不变。
- [ ] Preserve vendor-signature caveat; do not call the patched app vendor-signed. / 不宣称补丁后仍有效厂商签名。
- [ ] Real desktop external-link call launches the dedicated executable/profile. / 真实桌面调用打开专用浏览器。
- [ ] HTTP/HTTPS and encoded query strings are passed intact without shell interpretation. / 保留 URL 编码参数，不经命令解释器。
- [ ] Missing private browser and spawn failure do not invoke the default browser. / 缺失或启动失败不回退。
- [ ] Custom callbacks retain original dispatch; user completes actual OAuth return. / 回调原样分派，真实 OAuth 由用户验收。
- [ ] HTTP/HTTPS defaults and unrelated browser behavior remain unchanged. / 默认关联和其他浏览器行为不变。
- [ ] Normal desktop shortcut loads adapter without diagnostic arguments. / 原快捷方式普通启动仍生效。
- [ ] Actual rollback restores original hashes, then reinstallation is tested. / 真正回滚复原哈希，并测试重装。

## P2: MCP and Authenticated Work / MCP 与登录后任务

- [ ] Review pinned dependencies and retain a lockfile; no launch-time unpinned downloads. / 审核依赖和锁文件。
- [ ] MCP stdio handshake and tool list succeed; unadvertised dangerous tool call is rejected. / 握手列表成功，非白名单调用被拒。
- [ ] Browser navigation and content reading work through MCP. / MCP 实际导航读取通过。
- [ ] No persistent debugging TCP port; private Node network rule is reviewed. / 无常驻调试 TCP 端口，审查 Node 网络规则。
- [ ] Review browser evaluation, file/internal-network navigation, downloads, forms, and dialogs separately. / 另审页面执行、文件/内网导航、下载和提交权限。
- [ ] Close manual private browser before MCP to avoid profile lock contention. / 避免 Profile 锁冲突。
- [ ] User logs in and approves permissions personally; no automation of CAPTCHA or consent. / 用户亲自完成认证与授权。
- [ ] A real Claude model-driven MCP task works after login. / 登录后的真实模型任务通过。
- [ ] Inventory Code/Cowork children and update paths; do not infer inherited enforcement. / 单独验收子进程和更新路径。

## P3: Publication / 发布

- [ ] Run `npm test` and `npm run check:release`. / 执行测试和公开包检查。
- [ ] Parse PowerShell and compile C# sources without applying network rules. / 只检查语法/编译，不在 CI 中改网络。
- [ ] Review every archive entry, including hidden files; scan the ZIP content, not just working files. / 检查 ZIP 全部条目。
- [ ] Exclude profiles, binaries, patched archives, raw logs, credentials, real exit IP, and personal paths. / 排除私有资料。
- [ ] Verify bilingual links, scope wording, research dates and access limitations. / 核对双语链接与证据边界。
- [ ] Confirm repository name, owner, public visibility, license, and publication authorization. / 发布前确认仓库与许可授权。
- [ ] Mark authenticated/fresh-machine tests UNVERIFIED until performed. / 不把待验收内容写成通过。

## Result Template / 结果模板

```text
Check ID / 检查项:
Version and scope / 版本与范围:
Status: PASS | FAIL | UNVERIFIED
Positive control / 阳性对照:
Observation / 实际观察:
Limit / 不能推出的结论:
Recovery / 恢复状态:
Redacted evidence / 脱敏证据:
```

Audit CLI exit codes: 0 = all implemented checks pass; 1 = a checked failure or unreadable input; 2 = no checked failure but unresolved evidence remains. The current static auditor intentionally leaves live-network/authentication items UNVERIFIED. / 当前静态检查器有意保留动态网络和登录项目为未验证，不能靠它得到整机全面通过。
