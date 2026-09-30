'use strict';
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');

function createOpener(original, config, dependencies = {}) {
  const spawn = dependencies.spawn || cp.spawn;
  const exists = dependencies.exists || fs.existsSync;
  const record = dependencies.record || (() => {});
  return async function openExternal(value, options) {
    if (typeof value !== 'string') throw new TypeError('External URL must be a string');
    let url;
    try { url = new URL(value); } catch { throw new Error('Invalid external URL'); }
    let target = value;
    if (url.protocol === 'microsoft-edge:') {
      target = value.slice(value.indexOf(':') + 1);
      try { url = new URL(target); } catch { throw new Error('Unsupported browser URL'); }
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported browser URL');
    }
    if (!['http:', 'https:'].includes(url.protocol)) return original(value, options);
    if (url.username || url.password || /[\r\n\0]/.test(target)) throw new Error('Invalid browser URL');
    if (!exists(config.executable) || !exists(config.profile)) {
      record('missing-private-browser');
      throw new Error('Claude private Edge is unavailable; default browser fallback is disabled');
    }
    const args = [
      '--user-data-dir=' + config.profile, '--profile-directory=Default',
      '--proxy-server=http://127.0.0.1:18791', '--disable-quic', '--dns-prefetch-disable',
      '--force-webrtc-ip-handling-policy=disable_non_proxied_udp',
      '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1',
      '--no-first-run', '--no-default-browser-check', '--disable-sync',
      '--disable-features=msImplicitSignin', '--disable-background-networking',
      '--lang=en-US', target
    ];
    await new Promise((resolve, reject) => {
      let child;
      let timer;
      let done = false;
      const finish = (error) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        if (child) child.unref();
        record(error ? 'launch-failed' : 'launched');
        if (error) reject(new Error('Could not launch Claude private Edge; no default browser fallback'));
        else resolve();
      };
      try {
        child = spawn(config.executable, args, { shell: false, detached: true, stdio: 'ignore', windowsHide: false });
        child.once('error', () => finish(true));
        child.once('exit', code => finish(code !== 0));
        child.once('spawn', () => { timer = setTimeout(() => finish(false), 1500); });
      } catch { finish(true); }
    });
  };
}

function install(electron, config) {
  const { app, shell } = electron;
  const statusPath = path.join(config.root, 'external-links-status.json');
  const state = { version: 1, pid: process.pid, installedAt: new Date().toISOString(), webLaunches: 0, failures: 0 };
  const record = status => {
    state.lastStatus = status;
    state.updatedAt = new Date().toISOString();
    if (status === 'launched') state.webLaunches++;
    else if (status !== 'installed') state.failures++;
    // Never persist URLs, OAuth query strings, or browser command lines.
    try { fs.writeFileSync(statusPath, JSON.stringify(state, null, 2)); } catch {}
  };
  const opener = createOpener(shell.openExternal.bind(shell), config, { record });
  shell.openExternal = opener;
  if (shell.openExternal !== opener) throw new Error('Private browser adapter installation failed');
  record('installed');
  if (process.argv.includes('--claude-private-edge-check')) {
    app.whenReady().then(() => setTimeout(() => {
      shell.openExternal('https://api.ipify.org/').catch(() => {});
    }, 2500));
  }
}
module.exports = { createOpener, install };
