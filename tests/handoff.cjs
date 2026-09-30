'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const script=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][1][1];
const repo='https://github.com/jiusi1-cpu/claude-private-browser-kit';
async function check(locale,link,reject){
  let click,written,selected=false,focused=false;
  const prompt=html.match(new RegExp('<textarea id="prompt-'+locale+'"[^>]*>([\\s\\S]*?)</textarea>'))[1];
  assert(prompt.includes(repo));assert(prompt.includes('AGENTS.md'));assert(prompt.includes('docs/AGENT-START.'+(locale==='zh'?'zh-CN':'en')+'.md'));
  const field={value:prompt,focus(){focused=true;},select(){selected=true;}};
  const status={textContent:''};
  const control={value:locale,addEventListener(){}};
  const button={dataset:link?{copy:'link',locale}:{copy:'prompt-'+locale},addEventListener(name,fn){assert.equal(name,'click');click=fn;}};
  const document={documentElement:{dataset:{lang:locale}},querySelector(){return {};},querySelectorAll(){return [button];},getElementById(id){return id==='language'?control:id==='prompt-'+locale?field:status;}};
  vm.runInNewContext(script,{document,localStorage:{setItem(){}},navigator:reject==='missing'?{}:{clipboard:{async writeText(text){if(reject)throw Error('denied');written=text;}}}});
  await click();
  if(reject){assert(selected&&focused);assert.match(status.textContent,/手动复制|manually/);}
  else{assert.equal(written,link?repo:prompt);assert.match(status.textContent,/已复制|Copied/);}
}
(async()=>{
  for(const locale of ['zh','en'])for(const link of [true,false])for(const reject of [false,true,'missing'])await check(locale,link,reject);
  for(const file of ['AGENTS.md','docs/AGENT-START.zh-CN.md','docs/AGENT-START.en.md'])assert(fs.existsSync(path.join(root,file)),file);
  for(const file of ['README.md','README.zh-CN.md','README.en.md','llms.txt'])assert(fs.readFileSync(path.join(root,file),'utf8').includes('AGENT-START.'),file);
  assert.equal(fs.readFileSync(path.join(root,'README.md'),'utf8'),fs.readFileSync(path.join(root,'README.zh-CN.md'),'utf8'));
  console.log('Agent handoff checks passed: bilingual prompts, exact copied contents, denied/missing clipboard fallback and entry links.');
})().catch(error=>{console.error(error);process.exitCode=1;});
