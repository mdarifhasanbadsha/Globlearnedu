const B="https://globlearnedu.com/api/public/chat"; let t="";
const ask=async m=>{const r=await fetch(B,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:m,token:t})});if(!r.ok)return"[HTTP "+r.status+"]";const j=JSON.parse(await r.text());if(j.token)t=j.token;return j.reply===null?"(silent)":String(j.reply);};
const w=ms=>new Promise(r=>setTimeout(r,ms));
let pass=0,fail=0;
const c=(n,x,d="")=>{console.log(`${x?"PASS":"FAIL"}  ${n}`); if(x)pass++;else{fail++;if(d)console.log("      "+d.slice(0,260));}};

let a=await ask("March 2027 Intake-er scholarship er sujog ki?");
console.log("Q: March 2027 Intake-er scholarship er sujog ki?");
console.log("A:", a);
console.log();
c("no 'both free' claim", !/দুটোই ফ্রি|দুটাই ফ্রি/i.test(a), a);
c("says partial", /partial|আংশিক/i.test(a), a);
c("mentions September for full", /সেপ্টেম্বর|September/i.test(a), a);
c("asks contact", /নম্বর|contact|number/i.test(a), a);
await w(1600);

a=await ask("September e ki full scholarship pabo?");
console.log("\nQ: September e full scholarship pabo?");
console.log("A:", a.slice(0,320));

console.log(`\nRESULT: ${pass} pass, ${fail} fail`);
