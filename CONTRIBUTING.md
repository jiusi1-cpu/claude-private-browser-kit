# Contributing / 参与贡献

The highest-value contributions are fresh Windows deployment evidence, application-update compatibility, rollback validation, and precise network-test methodology. Do not add one-click deployment claims before reproducible testing.

最需要的贡献：全新 Windows 环境复现、应用升级兼容性、真实回滚验证，以及有阳性对照的网络检查。没有复现证据前，不把参考脚本宣传为一键安装器。

## Report a Problem / 报告问题

Include Windows, Claude Desktop, Edge and Node versions; the relevant module; sanitized reproduction steps; expected and observed behavior; and whether the result is static or live. State whether you modified a reference script.

请注明系统与应用版本、相关模块、脱敏复现步骤、预期和实际行为，区分静态检查与真实网络实验，并说明是否改过参考脚本。

Never attach tokens, account details, proxy credentials, real exit IPs, browser profiles, original application archives or raw diagnostic bundles. See [security boundaries](SECURITY.md) before sharing evidence.

不要上传令牌、账号信息、代理凭据、真实出口 IP、浏览器资料、原始应用包或未审核的诊断压缩包。

## Check a Change / 验证修改

Run `npm test` and `npm run check:release` with Node.js 22+. No dependency installation is needed. Keep English and Chinese claims consistent. Tests must not install WFP rules or alter the user's browser settings. Live tests require an explicit test plan and rollback.
