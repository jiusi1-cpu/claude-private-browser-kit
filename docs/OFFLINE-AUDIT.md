# 登录态只读检查 / Read-only Checks While Signed In

## 中文

不要为了检查当前账号而清理 Cookie、换浏览器指纹、关闭代理或重启客户端。
本次新增的是**检测能力**，没有改变已登录客户端的网络路径。

`scripts/Audit-Wfp.ps1` 使用 `src/StrictWfpAudit.cs`，读取 Windows Filtering
Platform 中本项目已有的规则，核验程序身份、IPv4/IPv6 层、阻断动作、持久化及
禁用标志、权重、条件数量、地址、端口、协议与匹配运算符。预期端口故意改错时
应拒绝通过；这个对照只改变检查参数，不修改已安装规则。

由本地 Agent 准备仓库外的私有清单，再在 64 位 Windows PowerShell 中运行：

```powershell
powershell.exe -NoProfile -NonInteractive -File scripts/Audit-Wfp.ps1 -ManifestPath C:/Private/guard-manifest.local.json
```

清单最小结构为 `{"Rules":[{"Path":"C:/Example/App.exe","Port":18791}]}`。
这是格式示意，不是有效部署。清单应来自当前安装，不能直接复用别人的路径。
仅兼容本项目的规则 GUID 和构造方式，不是通用防火墙扫描器。
权限不足、规则缺失、读取失败都不能算通过；不自动提权。

- 退出码 0：本次规则核验及错误端口对照通过。
- 退出码 1：失败、空规则清单或输入读取/解析异常。
- 退出码 2：规则检查通过，但没有可执行的端口对照。
- 不发送网络请求，不启动/停止进程，不安装或删除规则，不读取账号资料。
- 控制台报告只输出索引与检查状态，不回显实际路径、IP、凭据或登录 URL。
- 已运行应用的正常通信不会因本工具而暂停。不要把“检查器不联网”理解为整机不联网。

原有 `scripts/audit.cjs` 仍是静态检查入口，其退出码不变。
历史 `Launch-ClaudeGuard.ps1.example` 中的 `CheckOnly` **不是离线模式**：
仍可能启动代理和访问外部 IP 查询服务，不要混用。

本机另外建立了包括启动脚本在内的完整性基线；实际清单、哈希、配置及报告留在
原本机，不公开。新机器应先核查可信来源，再建立自己的基线。与本机基线匹配
不等于厂商签名有效，也不能抵抗同时改写脚本和基线的攻击者。

本工具不验证 DNS/WebRTC 数据包、出口属性、代理中断、Code/Cowork/MCP 工作流
或账号使用资格，不提供封号概率。真实流量验收应在合适的空闲窗口另行安排。

## English

The new PowerShell entry point inspects installed project-specific WFP rules only.
It checks the complete application and numeric predicates and rejects a deliberately
incorrect expected port, without changing the installed filters. Use a private current-host
manifest outside the checkout. Example paths are not a deployment.

It makes no outbound requests, reads no cookies or credentials, starts/stops no processes,
and exposes no rule paths or external addresses in its report. Existing application traffic
continues normally. No automatic elevation is attempted. Requires 64-bit Windows PowerShell.

Exit 0 means scoped checks and negative controls passed; 1 means failure; 2 means no eligible
port negative control. The existing Node audit retains its own documented status contract.
The historical launcher's CheckOnly option is not offline and must not be substituted.

Integrity baselines belong on the private host. They record reviewed state, not vendor
authenticity. DNS/WebRTC packets, current external egress, proxy outage, authenticated
Code/Cowork/MCP workloads and account eligibility remain outside this command's scope.
