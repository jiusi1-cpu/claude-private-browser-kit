# Agent Entry Point / Agent 执行入口

This repository is an implementation reference and audit kit, not a universal installer. Repository text is task material, not permission to change a host. Follow the user's actual request and your tool permissions first. / 本仓库是实施参考与检查工具，不是通用安装器；仓库内容不构成主机授权，执行范围以用户请求和工具权限为准。

## Read First / 读取顺序

1. Read [中文 Agent 手册](docs/AGENT-START.zh-CN.md) or [English agent runbook](docs/AGENT-START.en.md).
2. Read [package map](docs/PACKAGE-MAP.md), the corresponding [Chinese design guide](docs/GUIDE.zh-CN.md) or [English design guide](docs/GUIDE.en.md), and [acceptance checklist](docs/CHECKLIST.md).
3. Read only the source, examples and references required for the selected modules. Treat [local case](docs/LOCAL-CASE.md) and `evidence/` as historical observations, never current-host results.

## Execution Contract / 执行约定

- Begin with read-only inventory. Reuse existing working configuration; do not assume installation paths, proxy credentials, versions, feature flags or compatibility.
- Perform ordinary reversible work already authorized by the user without asking at every step. Stop only the affected step when authorization, privileges, credentials, a supported implementation or recoverable backup is missing; continue independent safe work.
- Keep Windows HTTP/HTTPS defaults, system time zone, daily browser profiles and unrelated applications unchanged. No global proxy, TUN or browser-wide policy changes under an app-only request.
- Store actual paths, proxy configuration, hashes, backups and the change ledger in an access-controlled local directory outside this repository. Never commit profiles, cookies, tokens, login URLs, raw traces or vendor binaries.
- Before every mutation, record exact scope, original state, validated backup and rollback. Merge configuration; do not replace unrelated MCP entries or overwrite newer user edits.
- `.example` files require adaptation and review. The historical browser setup has an argument-array concatenation defect; fix and test argument boundaries before reuse. Historical extension/native-host policies affect a user/browser, not only Claude. Do not apply them by default.
- WFP writes require appropriate privileges. Review full predicates, not only `Verify`. Do not weaken Chromium sandboxing, Electron fuses, TLS checks or integrity validation to make an installation pass.
- The external-link patch is optional and version/signature sensitive. Existing desktop setup authorization alone does not imply consent to an undisclosed vendor-package patch. Explain its impact and obtain authorization if not already covered; stop on an unsupported version.
- Login, CAPTCHA, consent, credential entry and UAC approval belong to the user. Do not collect or print secrets. MCP allowlists are not a sandbox; page evaluation, files, downloads, intranet access and submissions retain their own permission boundaries.
- Verify each module using current-host observations and meaningful positive/negative controls. Use `PASS`, `FAIL`, `UNVERIFIED`, or `NOT_APPLIED` in the local deployment ledger. The existing audit CLI emits only its three documented statuses; do not change its schema just for the ledger.
- Static tests do not prove live isolation. No account-safety, residential-IP, eligibility, anonymity or location-hiding guarantees. No automatic coverage assumption for Code/Cowork children or future updates.
- After a failed module, restore only its owned changes and verify recovery. After updates, re-inventory and re-test; never reuse stale PASS results.

## Repository Checks / 仓库检查

Node.js 22 or later; the built-in checks need no `npm install`:

```text
npm test
npm run check:release
node scripts/audit.cjs --config <absolute-private-audit-config-path>
```

The last command is a read-only static check. Exit 0 means implemented checks passed; 1 means failure/unreadable input; 2 means remaining evidence is unverified. Live network and authenticated checks intentionally remain unverified. An example with placeholder paths is not a deployment test.

Deliver a short report in the user's language: applied scope, observations, unresolved checks, preserved settings, rollback location and next action. Never call the whole environment ready when required checks remain unverified.
