# Sanitized Local Case / 本机脱敏案例

Date / 日期: 2026-09-30. Evidence is historical, not a claim of current server behavior or a fresh installation on another machine. / 这是历史本机证据，不代表当前服务端机制或其他机器已部署成功。

| Area / 项目 | Observation / 观察 | Boundary / 边界 |
| --- | --- | --- |
| Versions / 版本 | Claude 2.9939.2; Edge 154.0.4258.37; MCP package 0.0.83 | No cross-version support claim / 不宣称跨版本支持 |
| Browser / 浏览器 | Real copied executable, separate profile, sandbox retained / 实体副本、独立资料、保留沙箱 | Same Windows account, not VM / 不是 VM |
| Egress / 出口 | Browser and MCP returned the configured same IP / 浏览器与 MCP 返回已配置出口 | Actual IP removed; not a residential/reputation certificate / 隐去真实 IP，不认证家宽 |
| WebRTC | No ICE candidates in the specific public-STUN experiment / 指定实验候选为空 | API still exists / API 仍存在 |
| Direct traffic / 直连 | Browser IPv4 denied; unavailable proxy failed / IPv4 直连拒绝，代理故障失败 | No arbitrary child-process proof / 不证明任意子进程 |
| UDP | Positive receiver baseline succeeded; protected packet not received / 接收阳性对照成功，受保护包未达 | Probe shared filter template; not every app's UDP / 探针模板实验 |
| DNS | Actual browser fresh hostname: 20 baseline events, zero target events, HTTP response / 20 条阳性事件、目标零事件、获得响应 | Specific observation window; upstream resolution separate / 只限窗口，上游另查 |
| IPv6 | Browser returned ADDRESS_UNREACHABLE; separate loopback probe denied / 浏览器不可达，独立回环探针被拒 | Browser failure alone does not isolate WFP / 不由不可达单独归因 |
| MCP | Handshake, list, deny unsafe tool, navigation and IP read passed / 协议与浏览器操作通过 | Not a logged-in Claude model session / 不是登录后模型任务 |
| WFP | 17 private runtime path-rule sets present / 17 项专用路径规则存在 | Presence/basic metadata, not all predicates / 非完整条件审计 |
| External links / 外部链接 | Real desktop diagnostic spawned private Edge; daily Edge PID unchanged / 真实进程调用成功，日常进程未变 | Actual user login not performed / 未操作真实登录 |
| Defaults / 默认关联 | HTTP/HTTPS ProgId and Windows hash unchanged / 两项关联和校验值不变 | Callback executable casing re-registered by app; same effective path / 回调大小写变化但路径不变 |
| Integrity / 完整性 | All 369 packed-entry digests and embedded header digest matched; fuses unchanged / 摘要与 fuse 检查通过 | Vendor signature already invalid before patch / 原签名此前已无效 |
| Rollback / 回滚 | EXE, ASAR, manifest restored to original hashes, then patch reapplied / 三文件真实回滚后重装 | Not a rollback of every historical network/config change / 非全部历史配置回滚 |

The external-link turn could not read the newly opened IP page due to a window-binding error. Earlier browser/MCP IP checks passed; the later routing test must not be presented as a new egress verification. / 外部链接那轮因窗口绑定错误未读到 IP 页面，不能冒充重新测过出口。

Minimal machine-readable evidence: [local-case.redacted.json](../evidence/local-case.redacted.json). Raw screenshots, process logs, authentication material, usernames, real exit IP, and private backups are excluded. / 机器可读摘要已脱敏，原始私人材料不公开。

Still **UNVERIFIED**: full OAuth login return, authenticated Claude selecting MCP, all Code/Cowork subprocess routes, fresh Windows deployment of this public kit, long-term IP stability, and platform enforcement outcomes. / 以上项目仍需独立验收。
