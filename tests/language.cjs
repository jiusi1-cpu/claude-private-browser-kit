'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
assert.equal(scripts.length,2);
function simulate(browser,saved,blocked=false){
  let change;
  const control={value:'',addEventListener:(name,fn)=>{assert.equal(name,'change');change=fn;}};
  const document={documentElement:{dataset:{}},title:'',getElementById:()=>control,querySelector:()=>({content:''}),querySelectorAll:()=>[]};
  const storage={value:saved,getItem(){if(blocked)throw Error('blocked');return this.value;},setItem(k,v){if(blocked)throw Error('blocked');assert.equal(k,'cpbk-language');this.value=v;}};
  const ctx=vm.createContext({navigator:{languages:[browser],language:browser},localStorage:storage,document});
  for(const script of scripts)vm.runInContext(script,ctx);
  return {document,control,storage,change:()=>change()};
}
for(const browser of ['zh-CN','zh-TW','zh-HK','zh'])assert.equal(simulate(browser).control.value,'zh');
for(const browser of ['en-US','en-GB','ja-JP','fr',''])assert.equal(simulate(browser).control.value,'en');
assert.equal(simulate('zh-CN','en').control.value,'en');
assert.equal(simulate('en-US','zh').control.value,'zh');
assert.equal(simulate('zh-CN','invalid').control.value,'zh');
const state=simulate('en-US');state.control.value='zh';state.change();
assert.equal(state.document.documentElement.lang,'zh-CN');assert.equal(state.storage.value,'zh');
assert.equal(simulate('en-US',state.storage.value).control.value,'zh');
const blocked=simulate('zh-CN',null,true);blocked.control.value='en';blocked.change();assert.equal(blocked.document.documentElement.lang,'en');
for(const m of html.matchAll(/src="(assets\/[^"?]+)"/g))assert(fs.existsSync(path.join(__dirname,'..',m[1])));
console.log('Language checks passed: Chinese variants, English fallback, saved choice, switching, blocked storage and local images.');
