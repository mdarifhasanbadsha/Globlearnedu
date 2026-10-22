const B="https://globlearnedu.com/api/public/chat"; let t="";
const ask=async m=>{const r=await fetch(B,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:m,token:t})});if(!r.ok)return"[HTTP "+r.status+"]";const j=JSON.parse(await r.text());if(j.token)t=j.token;return j.reply===null?"(silent)":String(j.reply);};
const w=ms=>new Promise(r=>setTimeout(r,ms));
console.log("Q: ami bachelor korte chai");
console.log("A:", (await ask("ami bachelor korte chai")).slice(0,140));
await w(1500);
console.log("\nQ: khoroch koto?");
console.log("A:", await ask("khoroch koto?"));
