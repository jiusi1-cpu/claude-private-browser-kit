# X Research and Evidence Limits / X 研究与证据边界

Research date / 检索日期: **2026-09-30**. This is an indexed-X literature review, not a complete crawl or verified account-enforcement investigation. / 本文是对搜索引擎收录的 X 内容进行审阅，不是全站抓取或已证实的账号风控调查。

## Method / 方法

Fifteen targeted search queries covered Chinese and English discussions of Claude/VPN bans, residential IP, exit switching, DNS leaks, UDP/TCP, WebRTC, and desktop login/default-browser routing. One query limited dates after 2026-08-01. Exact technical keyword searches mostly returned irrelevant or no useful posts. Three directly relevant posts were retained; duplicates and unrelated VPN-building content were excluded. / 共 15 条中英文定向查询，含 2026-08-01 后的日期限制；精确技术词检索未得到可靠相关帖子，最终保留 3 篇直接相关原帖链接，不用无关结果凑数量。

Direct opening of all three X URLs returned **403**. The review therefore uses search-index excerpts, which included post text and displayed dates. The full threads, replies, attached images, edits, and current account state were not independently inspected. No fresh September enforcement claim was established. / 三个原帖直读均返回 403，只能依据收录文字和显示日期；未独立审阅完整线程、评论、图片和当前账号状态，也没有证实九月的新一轮风控机制。

No Anthropic official documentation or official X announcement was used as evidence for the claims below, matching the requested source scope. Search results containing official quotes or automated X trending summaries were not treated as mechanism evidence. / 按要求不以官方材料作本研究依据，也不把自动摘要当事实。

## Retained Sources / 保留来源

| Source / 来源 | Displayed date / 日期 | Indexed claim / 收录主张 | Weight / 证据权重 |
| --- | --- | --- | --- |
| [@mkdir700](https://x.com/mkdir700/status/2034448922429870472) | 2026-03-18 | Author reports a ban despite a residential IP and suspects unstable exits and other factors. / 自述使用住宅 IP 仍被封，推测出口切换等因素。 | Personal anecdote, multiple confounders, includes a commercial recommendation. Not a causal test. / 个案、多重混杂，含推荐。 |
| [@oyacaro](https://x.com/oyacaro/status/1927627973697700230) | 2025-05-28 | Author attributes an account ban to connecting a VPN to Macau. / 作者将封禁归因于 VPN 连到澳门。 | No server-side reason independently available; old report, not current policy. / 缺少独立服务端证据，不能作当前政策。 |
| [@AI_Jasonyu](https://x.com/AI_Jasonyu/status/2035687356104102330) | 2026-03-22 | Promotes a residential-IP/browser/payment combination and reports short-term stability. / 推广住宅 IP、浏览器和支付组合，报告短期稳定。 | Indexed as Paid partnership with referral links; commercial interest and short observation window. / 有付费合作标记与推广链接。 |

No posts are reproduced in full. Links preserve attribution; there is no proxy-provider endorsement. / 不转载全文，不背书任何代理商。

## Synthesis / 综合判断

**Supported only as community observations / 只能作为社区观察：** users report exit/location changes and account problems; commercial advice exists; reports conflict. These sources do not isolate causation, publish a denominator, or establish success rates. / 有人报告出口变化与账号问题，也有营销建议，但没有控制变量、样本基数或可靠成功率。

**Engineering inference / 工程推断：** observable routing and fail-closed behavior are more testable than an IP label. An unintended route change is a useful condition to detect even when its role in account enforcement is unknown. This inference motivates network tests, not an anti-ban claim. / 路径可观测、故障不直连，比“家宽”标签更可检验；这支持测试设计，不支持防封承诺。

**Not established / 没有证实：** residential IP prevents bans; TCP-only use prevents bans; disabling WebRTC removes all location signals; DNS location alone proves user location; matching language/time zone guarantees safety; a fingerprint browser is necessary; a fixed proxy establishes service eligibility. / 上述命题都不能由这些帖子推出。

## Mapping to This Project / 对本项目的影响

| Topic / 主题 | Action / 工程动作 | Claim limit / 限制 |
| --- | --- | --- |
| Exit instability / 出口不稳定 | Pin routes and test outage/recovery/reconnect / 固定路由并测试故障恢复 | No long-term stability or reputation certification / 不认证长期稳定或声誉 |
| Shared browser data / 浏览器资料混用 | Independent executable/profile and no imports / 程序与资料分开 | Same Windows user still shares OS/file access / 仍共享操作系统和用户权限 |
| DNS/WebRTC/UDP concerns / 泄漏顾虑 | Positive-control DNS/UDP tests, ICE observations / 做对照实验 | Technical observations only; not published detection rules / 不是平台检测规则 |
| Login uses daily browser / 登录入口错误 | Process-local external-link hook / 进程内入口适配 | Actual OAuth completion remains user-verified / 完整 OAuth 待用户验收 |
| Broad “all Claude” claim / 全覆盖说法 | Explicit process and capability inventory / 列出进程与能力范围 | Arbitrary children need separate controls / 任意子进程另查 |

## Alternative Tool Review / 现成方案比较

[Browser Tamer](https://github.com/aloneguid/bt) is an existing browser proxy/router, not code invented for this project. It was considered for source-based routing. The global-default-handler approach did not meet this case's requirement that unrelated application links avoid a new intermediary, so it was not installed or bundled. This is a scope decision, not a claim that the tool is defective. / 现成分流工具确实存在，但本案不接受全局默认入口架构，因此没有安装或打包它。

Future research should capture reproducible technical behavior on named versions, not accumulate more unsupported “ultimate anti-ban” recipes. / 后续应补版本明确的可复现行为证据，而非继续堆叠防封传言。
