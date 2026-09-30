'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const readJson = p => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));

function audit(config) {
  const checks = [];
  function add(name, status, detail) { checks.push({name, status, ...(detail ? {detail} : {})}); }
  function exists(key) {
    if (typeof config[key] !== 'string' || !config[key] || /C:[\\/]Example[\\/]/i.test(config[key])) {
      add(key, 'UNVERIFIED', 'Supply a real local path in a gitignored configuration'); return false;
    }
    const found = fs.existsSync(config[key]); add(key, found ? 'PASS' : 'FAIL', found ? undefined : 'Required local resource missing'); return found;
  }
  const present = {};
  for (const key of ['claudeExe','appAsar','privateEdgeExe','privateProfile','dailyEdgeExe','dailyProfile','guardManifest']) present[key] = exists(key);
  for (const [a,b,name] of [['privateEdgeExe','dailyEdgeExe','Distinct browser executable'],['privateProfile','dailyProfile','Distinct browser profile']]) {
    if (present[a] && present[b]) {
      const left = fs.realpathSync(config[a]).toLowerCase(), right = fs.realpathSync(config[b]).toLowerCase();
      const sa = fs.statSync(config[a]), sb = fs.statSync(config[b]);
      add(name, left !== right && !(sa.ino === sb.ino && sa.dev === sb.dev) ? 'PASS' : 'FAIL');
    }
  }
  if (present.appAsar && present.claudeExe) {
    try {
      const archive = fs.readFileSync(config.appAsar);
      const raw = archive.subarray(16, 16 + archive.readUInt32LE(12));
      const header = JSON.parse(raw);
      const base = 8 + archive.readUInt32LE(4);
      let count = 0, good = true;
      function walk(files) {
        for (const value of Object.values(files)) {
          if (value.files) walk(value.files);
          else if (!value.unpacked && value.offset !== undefined && value.integrity) {
            count++;
            const start = base + Number(value.offset);
            good &&= Number.isSafeInteger(start) && start >= base && start + value.size <= archive.length && sha(archive.subarray(start, start + value.size)) === value.integrity.hash;
          }
        }
      }
      walk(header.files);
      add('Packed file digests', count > 0 && good ? 'PASS' : 'FAIL', 'Checked entries: ' + count);
      const build = header.files?.['.vite']?.files?.build?.files;
      const entry = build?.['index.pre.js'];
      const pre = entry ? archive.subarray(base + Number(entry.offset), base + Number(entry.offset) + entry.size).toString() : '';
      add('Private links entry hook', !!build?.['claude-private-links.cjs'] && pre.includes('require("./claude-private-links.cjs").install(') ? 'PASS' : 'FAIL');
      const exe = fs.readFileSync(config.claudeExe);
      add('Embedded ASAR header digest', exe.includes(Buffer.from(JSON.stringify([{file:'resources\\app.asar',alg:'SHA256',value:sha(raw)}]))) ? 'PASS' : 'FAIL');
      add('Authenticode signature', 'UNVERIFIED', 'Use Get-AuthenticodeSignature; matching ASAR hashes do not restore a vendor signature');
    } catch { add('ASAR inspection', 'FAIL', 'Unreadable or unsupported archive; no content emitted'); }
  }
  if (present.guardManifest) {
    try {
      const manifest = readJson(config.guardManifest);
      const hashes = manifest.Hashes;
      const good = Array.isArray(hashes) && hashes.length > 0 && hashes.every(entry => fs.existsSync(entry.Path) && sha(fs.readFileSync(entry.Path)).toLowerCase() === String(entry.Hash).toLowerCase());
      add('Guard manifest file hashes', good ? 'PASS' : 'FAIL');
    } catch { add('Guard manifest file hashes', 'FAIL', 'Could not validate manifest'); }
  }
  for (const name of ['WFP condition values and delivery behavior','Windows default associations before/after','Browser egress IP and repeated stability','DNS positive-control trace','WebRTC ICE behavior','Proxy outage and recovery','User-completed login callback','Authenticated Claude MCP task']) add(name, 'UNVERIFIED', 'Requires the corresponding manual or controlled integration check');
  const status = checks.some(c=>c.status==='FAIL') ? 'FAIL' : checks.some(c=>c.status==='UNVERIFIED') ? 'UNVERIFIED' : 'PASS';
  return {schema:1, mode:'read-only-local-static-audit', status, checks};
}
if (require.main === module) {
  const index = process.argv.indexOf('--config');
  const file = index >= 0 ? process.argv[index+1] : path.join(__dirname,'../examples/audit.example.json');
  try {
    const result = audit(readJson(file)); console.log(JSON.stringify(result,null,2));
    process.exitCode = result.status === 'FAIL' ? 1 : result.status === 'UNVERIFIED' ? 2 : 0;
  } catch { console.error('Could not read audit config. No application or system configuration was changed.'); process.exitCode = 1; }
}
module.exports = {audit};
