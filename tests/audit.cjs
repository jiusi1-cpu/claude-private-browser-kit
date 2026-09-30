'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {audit} = require('../scripts/audit.cjs');
assert.equal(audit({}).status, 'UNVERIFIED');
assert.equal(audit(require('../examples/audit.example.json')).status, 'UNVERIFIED');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'private-browser-audit-'));
try {
  const file=path.join(tmp,'sample.txt'); fs.writeFileSync(file,'test');
  const result=audit({privateEdgeExe:file,dailyEdgeExe:file,privateProfile:tmp,dailyProfile:tmp});
  assert.equal(result.status,'FAIL');
  assert.equal(result.checks.find(c=>c.name==='Distinct browser executable').status,'FAIL');
  assert.equal(result.checks.find(c=>c.name==='Distinct browser profile').status,'FAIL');
  const missing=audit({privateEdgeExe:path.join(tmp,'missing.exe')});
  assert.equal(missing.status,'FAIL');
  assert(!JSON.stringify(result).includes(tmp));
  console.log('Audit tests passed: missing configuration stays UNVERIFIED; shared paths and missing files fail; output omits paths.');
} finally {
  const resolved=path.resolve(tmp);
  assert.equal(path.dirname(resolved),path.resolve(os.tmpdir()));
  assert(path.basename(resolved).startsWith('private-browser-audit-'));
  fs.rmSync(resolved,{recursive:true});
}
