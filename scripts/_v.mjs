const B="https://globlearnedu.com/api/public/chat"; let t="";
const ask=async m=>{const r=await fetch(B,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:m,token:t})});if(!r.ok)return"[HTTP "+r.status+"]";const j=JSON.parse(await r.text());if(j.token)t=j.token;return j.reply===null?"(silent)":String(j.reply);};
const w=ms=>new Promise(r=>setTimeout(r,ms));
for (const q of ["Hlw","Hlw","Hlw"]) {
  const a=await ask(q);
  console.log("\nS: "+q);
  console.log("A: "+a);
  await w(1400);
}
