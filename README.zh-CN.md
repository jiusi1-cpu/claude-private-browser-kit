# Claude Private Browser Kit

简体中文 | [English](README.md)

**给 Claude 一个专用浏览器，把日常浏览器留给自己。**

在 Windows 上分离 Claude Desktop 的外部链接、浏览器资料与代理路径，不接管其他软件的默认浏览器入口。

![架构示意：Claude 专用浏览器路径与日常浏览器路径分开](assets/social-preview.png)

**Windows | MIT | 研究预览版 | 中英文文档**

## 解决什么问题

Claude 打开网页，却跳进了你平时使用的浏览器。直接修改系统默认浏览器，又会影响其他软件。

这里整理的是更小范围的方案：Claude 进程内链接适配、独立 Edge 程序与资料目录、按程序路径约束网络。交付包含原创源码、只读检查器、可复核检查清单，以及回滚参考。

- **只针对指定路径：** 已测试案例中，Claude 的外部网页进入专用浏览器。
- **浏览器资料分开：** 专用程序与专用资料目录，需要独立维护安全更新。
- **检查结果分级：** 明确区分 PASS、FAIL 与 UNVERIFIED，不把静态检查冒充真实流量验收。

**这是源码与文档包，不是通用一键安装器。** 建议先运行下方安全检查，再结合自己的环境适配。

本项目整理了一套已在本机实施的方案：为 Claude Desktop 配置独立浏览器程序、独立资料目录、受约束的代理出口，并让 Claude 自己打开的外部网页进入专用浏览器，同时保留 Windows 原来的默认浏览器入口。

不承诺“不封号”“无法识别地区”，不提供指纹伪装，也不把代理当作服务使用资格。具备任意本机代码执行权限的智能体，不会因为这个浏览器配置就变成完整沙箱。请只访问你有权使用的账号、网络和服务。

## 阅读顺序

- [完整思路与实现逻辑](docs/GUIDE.zh-CN.md)
- [中英双语检查清单](docs/CHECKLIST.md)
- [X 研究：矛盾报告与证据边界](docs/RESEARCH-X.md)
- [本机脱敏验收记录](docs/LOCAL-CASE.md)
- [安全边界](SECURITY.md)
- [完整打包清单及不公开的内容](docs/PACKAGE-MAP.md)
- [GitHub 发布前检查](docs/RELEASE.md)
- [供 AI 阅读的精简文档索引](llms.txt)
- [贡献与复现问题](CONTRIBUTING.md)

## 工作路径

```text
Claude 桌面端打开 HTTP/HTTPS 网页
  -> 只在 Claude 进程内接管 shell.openExternal
  -> 专用 Edge 程序 + 专用资料目录
  -> 按程序路径设置 WFP 出站限制
  -> 本机 TCP 代理 -> 已授权的上游代理 -> 互联网

Claude 浏览器 MCP -> 专用 Node / 标准输入输出管道 -> 同一专用 Edge
其他 Windows 软件 -> 原来的系统默认网页入口 -> 日常浏览器
```

最终没有安装全局分流器。曾比较 Browser Tamer，但将其作为系统默认网页处理程序会让其他应用的链接也经过它，因此不符合本案例的隔离要求。

## 可以直接运行的检查

需要 Node.js 22 或更新版本；以下工具只用标准库，无须 `npm install`。

```powershell
npm test
npm run check:release
node scripts/audit.cjs --config examples/audit.example.json
```

第三条命令使用示例路径，预期返回 **UNVERIFIED，退出码 2**，不是环境已通过。建立自己的 `audit.local.json`，填入真实本机路径后再检查。该文件已被 Git 忽略，不应公开。

检查器只读，不联网、不改注册表、不安装防火墙规则、不修改程序。它能检查路径是否分离、文件哈希是否匹配、应用包中是否有适配入口；不能替代真实网络测试、登录验收或账号风控判断。

## 包含什么

| 目录或文件 | 用途 |
| --- | --- |
| `src/private-links.cjs` | Claude 进程内网页打开适配，不接管系统默认入口 |
| `src/ClaudeGuardWfp.cs` | WFP 网络限制源代码，修改规则需要 x64 管理员进程 |
| `src/NetworkProbe.cs` | TCP/UDP 控制实验探针源码，不含可执行文件 |
| `src/guarded-mcp.cjs` | 包围独立安装的 Playwright MCP 的标准输入输出白名单 |
| `scripts/` | 只读环境检查和公开包检查 |
| `reference/*.example` | 脱敏的历史实施脚本，需人工适配后使用 |
| `examples/` | 无真实节点和凭据的配置模板 |
| `evidence/` | 最小化历史检查结果，不包含私人路径和出口 IP |

## 已验证与未验证

原本机案例为 Claude Desktop `2.9939.2`、Edge `154.0.4258.37`、Playwright MCP `0.0.83`。已执行直连阻断、代理中断恢复、UDP 接收阳性对照、DNS 阳性对照、真实浏览器与 MCP 出口检查、外部链接路由及真实回滚。公开包本身没有在全新电脑上完整部署；保留的证据也没有证明登录后的真实 Claude 模型调用链通过。

## 重要取舍

- 应用补丁会改变厂商签名信任状态。本案例在补丁前已经是 HashMismatch；更新应用包摘要不会恢复厂商签名。
- 保留 Electron 安全 fuse 字节，不关闭应用包完整性检查。
- 独立 Edge 副本需要单独维护安全更新，不能长期冻结版本。
- 同一 Windows 用户下的独立资料目录不是虚拟机，也不是任意文件访问的隔离边界。
- 手动浏览器和 MCP 共用专用资料目录，开始 MCP 任务前应关闭手动实例。
- WFP `Verify` 只能检查规则存在及部分元数据，不能替代条件值审计和实际网络实验。
- 不修改时区；上述安全检查不会改系统代理、处理账号登录或发布 GitHub。

## 发布状态

原创代码与文档采用 [MIT](LICENSE)，依赖和商业软件边界见 [第三方说明](THIRD_PARTY_NOTICES.md)。本项目为非官方项目，与 Anthropic、Microsoft 无隶属关系。`package.json` 中 `private: true` 仅防止误发 npm，不影响 GitHub 开源。

## 常见问题

**会修改 Windows 默认浏览器吗？** 已记录案例没有部署全局网页分流器，适配入口只在 Claude 进程中。

**独立 Edge 资料目录就是安全沙箱吗？** 不是。它分离浏览器数据，不阻止同一 Windows 用户权限下的任意代码访问文件。

**能保证固定 IP 或不封号吗？** 不能。出口稳定性取决于已授权的上游服务，需要实际测量；本项目不承诺账号安全或地区使用资格。

**怎样让 AI 理解这个项目？** 从 [llms.txt](llms.txt) 进入指南和检查清单。这是阅读索引，不代表已经被搜索引擎收录或被 AI 推荐。
