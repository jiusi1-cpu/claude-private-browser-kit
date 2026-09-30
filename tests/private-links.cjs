'use strict';
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const { createOpener } = require('../src/private-links.cjs');
const config = { executable: 'C:\\Dedicated Edge\\msedge.exe', profile: 'C:\\Dedicated Edge\\Profile' };
const tests = [];
(async () => {
  const calls = [], original = [];
  const opener = createOpener(async (...args) => original.push(args), config, {
    exists: () => true,
    spawn: (...args) => { calls.push(args); const child = new EventEmitter(); child.unref = () => {}; setImmediate(() => child.emit('exit', 0)); return child; }
  });
  const url = 'https://example.com/auth?state=a%2Bb%26c&redirect_uri=claude%3A%2F%2Fcallback';
  await opener(url);
  assert.equal(calls[0][0], config.executable);
  assert.equal(calls[0][1].at(-1), url);
  assert.equal(calls[0][2].shell, false);
  assert(calls[0][1].includes('--proxy-server=http://127.0.0.1:18791'));
  assert.equal(original.length, 0);
  tests.push('HTTPS preserves exact URL and uses private executable/profile/proxy without shell');
  await opener('http://example.com/');
  await opener('microsoft-edge:https://example.com/');
  assert.equal(calls.length, 3);
  tests.push('HTTP and explicit Edge web protocol routed privately');
  const options = { activate: true };
  await opener('claude://callback?code=synthetic', options);
  assert.deepEqual(original, [['claude://callback?code=synthetic', options]]);
  tests.push('Custom callback protocol delegated unchanged');
  const missing = createOpener(() => { throw new Error('Unexpected fallback'); }, config, { exists: () => false });
  await assert.rejects(missing(url), /fallback is disabled/);
  tests.push('Missing browser fails closed');
  const failed = createOpener(() => { throw new Error('Unexpected fallback'); }, config, {
    exists: () => true, spawn: () => { throw new Error('sensitive URL must not be returned'); }
  });
  await assert.rejects(failed(url), /no default browser fallback/);
  tests.push('Spawn failure fails closed and redacts underlying errors');
  await assert.rejects(opener('https://user:password@example.com/'), /Invalid/);
  await assert.rejects(opener('not a URL'), /Invalid/);
  tests.push('Invalid and credential-bearing URLs rejected');
  const result = { checkedAt: new Date().toISOString(), passed: tests.length, tests };

  console.log(JSON.stringify(result, null, 2));
})().catch(error => { console.error(error.message); process.exitCode = 1; });
