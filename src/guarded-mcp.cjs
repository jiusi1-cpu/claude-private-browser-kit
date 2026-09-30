// Narrow stdio gate around the unmodified, pinned Playwright MCP package.
const { spawn } = require('node:child_process');
const { createInterface } = require('node:readline');
const path = require('node:path');
const allowed = new Set([
  'browser_close', 'browser_resize', 'browser_console_messages',
  'browser_handle_dialog', 'browser_evaluate', 'browser_navigate',
  'browser_navigate_back', 'browser_snapshot', 'browser_click',
  'browser_drag', 'browser_hover', 'browser_type', 'browser_press_key',
  'browser_select_option', 'browser_tabs', 'browser_take_screenshot',
  'browser_wait_for', 'browser_network_requests', 'browser_fill_form'
]);
const listRequests = new Set();
const child = spawn(process.execPath, [
  path.join(__dirname, 'node_modules/@playwright/mcp/cli.js'),
  '--config', path.join(__dirname, 'browser-config.json')
], { cwd: path.resolve(__dirname, '../workspace'), windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });
const send = message => process.stdout.write(JSON.stringify(message) + '\n');
createInterface({ input: process.stdin }).on('line', line => {
  let message;
  try { message = JSON.parse(line); } catch { return; }
  if (message.method === 'tools/call' && !allowed.has(message.params?.name)) {
    send({ jsonrpc: '2.0', id: message.id, error: { code: -32601, message: 'Tool denied by the dedicated-browser allowlist.' } });
    return;
  }
  if (message.method === 'tools/list') listRequests.add(message.id);
  child.stdin.write(JSON.stringify(message) + '\n');
});
createInterface({ input: child.stdout }).on('line', line => {
  let message;
  try { message = JSON.parse(line); } catch { return; }
  if (!message.method && listRequests.delete(message.id) && message.result?.tools) {
    message.result.tools = message.result.tools.filter(tool => allowed.has(tool.name));
  }
  send(message);
});
child.stderr.pipe(process.stderr);
process.stdin.on('end', () => child.stdin.end());
child.on('error', error => { process.stderr.write(error.message + '\n'); process.exitCode = 1; });
child.on('exit', code => process.exit(code ?? 1));
process.on('SIGTERM', () => child.kill());
process.on('SIGINT', () => child.kill());
