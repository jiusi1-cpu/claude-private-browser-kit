# Complete Design and Implementation Logic

[简体中文](GUIDE.zh-CN.md) · [Audit checklist](CHECKLIST.md) · [Home](../README.md)

## 1. Define Observable Goals

The goal is predictable routing, no accidental direct fallback, separation from daily browser data, consistent browser selection for desktop links and MCP tasks, and recoverable changes. This does not establish that a service cannot infer location. Community posts motivate questions; they do not reveal a service's enforcement algorithm. See [X research](RESEARCH-X.md).

| Initial request | Engineering interpretation | Unsupported conclusion |
| --- | --- | --- |
| Clean/residential IP | User-supplied authorized proxy; inspect actual egress, ownership claims, stability | ASN or one IP check proves residential service, exclusivity, reputation, or account safety |
| Stable IP | Pin routing and repeat after reconnect/restart | A short test proves permanent stability |
| TCP only, no UDP | Restrict listed application paths to one IPv4 TCP loopback endpoint | All child processes and system services are covered |
| No WebRTC exposure | Restrict non-proxied UDP and inspect ICE/network behavior | WebRTC is removed from the browser |
| DNS through proxy | Fresh hostname plus resolver positive control; separately consider upstream resolution | Disabling the proxy's DNS server disables all Windows DNS |
| Language/time zone | Chosen browser language; leave system time zone unchanged as requested | All location signals are aligned or hidden |

## 2. Five Independent Paths

1. Desktop main-process traffic: fixed local proxy and executable-path restrictions.
2. Built-in browser tools: disabled in the final case to avoid mixing browser routes.
3. Playwright MCP: private Node/stdio controlling a chosen browser executable.
4. Login/help/external links: desktop `shell.openExternal`, originally using Windows defaults.
5. Claude Code and other children: independent network and process-launch behavior, not automatically governed by the other paths.

This explains the original failure: configuring an MCP browser does not change the login button's default-browser call.

## 3. Alternatives and Decisions

| Option | Benefit | Decision |
| --- | --- | --- |
| Global default link router | Existing tools; no desktop package patch | Rejected: unrelated application links would also traverse the router |
| Another Edge profile only | Separates browser data | Insufficient for executable-path network separation or desktop login routing |
| Separate executable copy plus profile | App-path policy and data separation | Used, with a separate security-update burden |
| Process-local desktop link adapter | Does not change Windows defaults | Used only after approval of version coupling and signature implications |
| Separate Windows user or VM | Stronger OS/account/file boundaries | Outside the implemented scope, not equivalent to a separate profile |

## 4. Browser and Network Layer

Keep the executable directory, browser profile, and MCP workspace separate. Do not import daily cookies, identities, passwords, history, or extensions. Use a real executable copy rather than a symbolic or hard link; verify source/copy hashes and signatures. Use debugging pipes rather than a persistent TCP debugging port.

The WFP helper creates negative block filters scoped to an application path: block addresses other than IPv4 loopback, ports other than the selected port, protocols other than TCP, and all IPv6. Port zero means block all outbound traffic for that path. Leaving an endpoint unblocked by these filters does not override other Windows rules that might block it.

Rules do not automatically cover every child executable or a new path introduced by an update. `Verify` checks presence and selected metadata, not every address/port/protocol predicate. Behavior tests are essential.

The local topology used a dedicated loopback proxy, an optional local relay, and a fixed upstream. The public YAML is a simpler one-upstream template using TEST-NET, not an operational proxy. Disabling UDP, proxy DNS service, and TUN applies to that proxy configuration, not all Windows networking. Upstream hostname resolution needs a separate check.

Browser arguments pin the proxy, disable QUIC and DNS prefetch, restrict non-proxied WebRTC UDP, and prevent ordinary target hostname resolution locally. Arguments supplement rather than replace WFP. Keep Chromium sandboxing enabled. A historical copied-browser launch failure was fixed by read/execute ACLs on the application directory, not by opening the profile or disabling the sandbox.

## 5. MCP Layer

The case pinned `@playwright/mcp@0.0.83` in a private directory. Dependencies are not redistributed. A new deployment must choose/review its version and retain a lockfile.

`guarded-mcp.cjs` expects this deployment layout; running it in the repository's `src` directory is not a complete installation:

```text
PrivateEdge/
  Application/             user-supplied browser
  Profile/                 private, never publish
  workspace/               private screenshots/logs, never publish
  mcp/
    node.exe               user-supplied private runtime
    guarded-mcp.cjs
    browser-config.json    adapted private configuration
    node_modules/@playwright/mcp/
```

The allowlist includes 19 browser tools and excludes the unrestricted host-code, browser-installation, and upload tools. It still includes browser evaluation. This is not a security sandbox: scripts, forms, file URLs, downloads, intranet navigation, and dialog acceptance need independent permissions/target policies. Blocking the Node process's network access does not prevent the browser from making requests.

Merge the configuration fragment rather than replacing unrelated MCP servers. Feature flags for Cowork, Code, MCP, and extensions are not evidence that their authenticated workflows work. Those workflows remain a separate acceptance gate.

## 6. Claude-Only External Links

The startup hook installs the adapter before the original main-process code. It saves the original `shell.openExternal`, handles HTTP/HTTPS using `spawn(executable, args, {shell:false})`, and passes the original URL as one argument. Explicit `microsoft-edge:https://...` wrappers are also redirected. Other protocols retain their original handling, including the `claude://` callback.

Missing executable/profile or launch failure rejects the request without falling back to the daily browser. A successfully spawned process is not proof that its page loaded. The diagnostic records counts, timestamps, and process ID only, never URLs; this does not guarantee that the unmodified application, browser, or MCP never logs sensitive data.

The optional `--claude-private-edge-check` startup flag opens only a fixed public IP-test page through the adapter. Normal desktop startup does not trigger it. It does not log in or inspect tokens.

Patch procedure: back up EXE/ASAR/guard manifest; check input hashes; append the original adapter and startup call; update ASAR entry integrity and the executable's embedded header digest; keep Electron fuses unchanged; update the guard's own executable hash. Matching package digests does not restore vendor Authenticode. Restore bytes on write failure; rollback refuses to overwrite files changed since patching.

The exported patch script is a redacted historical reference, not a universal installer. Do not guess versions, blindly replace strings, disable validation, or treat a hash update as re-signing. Adapt and review first.

## 7. Deployment and Acceptance Order

1. Inventory installation paths, active tasks, HTTP/HTTPS associations, callback registration, and policies. Keep backups private.
2. Prepare an independent browser copy and empty profile; check real paths, signatures, hashes, and sandbox ACLs.
3. Configure an authorized proxy and test it separately. Keep credentials outside the repository and logs.
4. Apply reviewed path-specific rules with a precise change inventory. Establish positive controls for probes.
5. Test the actual browser's egress, direct denial, outage behavior, UDP/DNS controls, and WebRTC observation.
6. Integrate and exercise MCP; close any manually opened private browser first to avoid profile locking.
7. Back up and adapt the desktop external-link path. Use a non-authenticated page; confirm defaults and unrelated browsers remain unchanged.
8. Let the user complete login, CAPTCHA, and consent, then test real model-driven MCP and Code/Cowork children.
9. Exercise rollback, cold starts, and update re-registration. The historical logon task started the proxy only; Claude remained manual.

## 8. Public-Package Boundaries

Distinguish private live configuration, redacted historical evidence, portable read-only checks, and implementation references. A redacted script is not a one-click product, and another machine's historical PASS is not the reader's PASS. Missing evidence must stay UNVERIFIED.

The package contains original sources, bilingual documentation, a static auditor, tests, and publication-hygiene checks. Fresh-Windows deployment, authenticated workflows, deeper security review, owner attribution, and final publication approval remain release gates. See [release readiness](RELEASE.md).
