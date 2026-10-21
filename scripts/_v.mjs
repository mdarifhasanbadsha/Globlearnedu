const B="https://globlearnedu.com/api/public/chat"; let t="";
const s=async(m)=>{const r=await fetch(B,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:m,token:t})});const x=await r.text();if(!r.ok)return`ERR ${r.status}`;const j=JSON.parse(x);if(j.token)t=j.token;return j.reply===null?"(silent)":String(j.reply);};
for (const m of ["ami CST niye bachelor korte chai","kon university ache CST te?","khoroch kemon?","tumi ekta pagol bot"]) {
  console.log(`S: ${m}`);
  console.log(`A: ${(await s(m)).slice(0,230)}\n`);
  await new Promise(r=>setTimeout(r,1500));
}
