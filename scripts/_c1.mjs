// CONVERSATION 1 — a genuine interested student, Diploma
const B="https://globlearnedu.com/api/public/chat";
let t="";
const send=async(m)=>{const r=await fetch(B,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:m,token:t})});const x=await r.text();if(!r.ok)return`[ERR ${r.status}]`;const j=JSON.parse(x);if(j.token)t=j.token;return j.reply===null?"(silent)":String(j.reply);};
const log=[];

console.log("=".repeat(70));
console.log("CONVERSATION 1 — genuine student, Diploma in China");
console.log("=".repeat(70));

const turns1 = [
  "assalamu alaikum",
  "ami diploma korte chai china te",
  "CST te",
  "amar SSC 4.20, HSC 3.90",
  "2021 e HSC",
  "khoroch kemon hobe?",
  "ei taka ami ekbare dite parbo na",
  "documents ki ki lage?",
  "apnader office kothay?",
];
for (const m of turns1) {
  const a = await send(m);
  console.log(`\nS: ${m}`);
  console.log(`A: ${a.slice(0,340)}`);
  log.push({conv:1, s:m, a});
  await new Promise(r=>setTimeout(r,1400));
}
require("fs").writeFileSync("scripts/_c1.json", JSON.stringify(log,null,2));
