'use strict';
const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
const issues=[];
const files=[];
const allowed=new Set(['.md','.json','.cjs','.cs','.ps1','.yaml','.yml','.example']);
function walk(dir) {
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})) {
    const full=path.join(dir,entry.name), rel=path.relative(root,full).replaceAll('\\','/');
    if(entry.isSymbolicLink()) { issues.push({file:rel,reason:'symlink not allowed'}); continue; }
    if(entry.isDirectory()) {
      // Checkout metadata is present in CI, but is never part of a release archive.
      if(entry.name==='.git') continue;
      if(/^(node_modules|runtime|backups|Profile|User Data|logs|\.git)$/i.test(entry.name)) issues.push({file:rel,reason:'private or generated directory'});
      else walk(full);
      continue;
    }
    files.push(rel);
    const data=fs.readFileSync(full);
    if(rel==='assets/social-preview.png') {
      if(data.length>1000000 || data.subarray(0,8).toString('hex')!=='89504e470d0a1a0a') issues.push({file:rel,reason:'invalid or oversized preview PNG'});
      continue;
    }
    if(!allowed.has(path.extname(entry.name))&&!['LICENSE','.gitignore'].includes(entry.name)&&rel!=='llms.txt') issues.push({file:rel,reason:'non-allowlisted file type'});
    if(data.includes(0)) { issues.push({file:rel,reason:'binary data'}); continue; }
    const text=data.toString('utf8');
    if(/[A-Za-z]:[\\/]+Users[\\/]+[^\\/\s"']+/.test(text)) issues.push({file:rel,reason:'personal Windows home path'});
    if(/(?:sk-ant-[A-Za-z0-9_-]{15,}|gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/.test(text)) issues.push({file:rel,reason:'credential pattern'});
    // One known synthetic rejection fixture; never exempt other files or values.
    const syntheticUrl=['https:','','user:password@example.com',''].join('/');
    const urlText=rel==='tests/private-links.cjs' ? text.replaceAll(syntheticUrl,'') : text;
    if(/https?:\/\/[^\s/]+:[^\s/]+@/i.test(urlText)) issues.push({file:rel,reason:'credential-bearing URL'});
    for(const match of text.matchAll(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g)) {
      const octets=match[0].split('.').map(Number);
      if(octets.some(v=>v>255)) continue;
      const permitted=match[0]==='0.0.0.0'||match[0]==='1.1.1.1'||octets[0]===127||match[0].startsWith('192.0.2.')||match[0].startsWith('198.51.100.')||match[0].startsWith('203.0.113.');
      if(!permitted) issues.push({file:rel,reason:'non-allowlisted IPv4 literal'});
    }
    if(entry.name.endsWith('.json')) { try{JSON.parse(text);}catch{issues.push({file:rel,reason:'invalid JSON'});} }
    if(entry.name.endsWith('.cjs')) {
      const check=cp.spawnSync(process.execPath,['--check',full],{encoding:'utf8',windowsHide:true});
      if(check.status!==0) issues.push({file:rel,reason:'JavaScript syntax check failed'});
    }
    if(entry.name.endsWith('.cjs.example')) {
      try { new (require('node:vm').Script)(text); }
      catch { issues.push({file:rel,reason:'JavaScript reference syntax check failed'}); }
    }
    if(entry.name.endsWith('.md')||rel==='llms.txt') for(const link of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const target=link[1].split('#')[0];
      if(!target||/^[a-z]+:/i.test(target))continue;
      const resolved=path.resolve(path.dirname(full),decodeURIComponent(target));
      if(!resolved.startsWith(root+path.sep)||!fs.existsSync(resolved)) issues.push({file:rel,reason:'missing or out-of-tree Markdown link'});
    }
  }
}
walk(root);
console.log(JSON.stringify({status:issues.length?'FAIL':'PASS',files:files.length,issues,note:'Heuristic source-package hygiene check, not a comprehensive secret detector or application security audit.'},null,2));
process.exitCode=issues.length?1:0;
