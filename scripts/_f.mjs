const B="https://globlearnedu.com/api/public/chat"; let t="";
const ask=async m=>{const r=await fetch(B,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:m,token:t})});if(!r.ok)return`ERR ${r.status}`;const j=JSON.parse(await r.text());if(j.token)t=j.token;return j.reply===null?"(silent)":String(j.reply);};
const w=ms=>new Promise(r=>setTimeout(r,ms));
let pass=0,fail=0;
const c=(n,x,d="")=>{console.log(`${x?"PASS":"FAIL"}  ${n}`); if(x)pass++;else{fail++;if(d)console.log("      "+d.slice(0,200));}};

let a=await ask("hi"); c("1 short greeting", a.length<170); await w(1300);

a=await ask("fee koto");
c("2 first fee: no figure", !/৯৯,০০০|১,২০,০০০|২,০০০/.test(a), a);
c("2b reassuring", /affordable|ভাবনার চেয়ে|কম/i.test(a)); await w(1300);

a=await ask("abar bolen, mot koto hobe?");
c("3 repeat: figures", /[০-৯]{2}/.test(a), a); await w(1300);

a=await ask("NUIST e March intake?");
c("4 no March promise", !/March[^\n]{0,40}(available|আছে|পাবেন)/i.test(a), a);
c("4b says September", /September|সেপ্টেম্বর/i.test(a)); await w(1300);

a=await ask("language program intake?");
c("5 language both months", /March/i.test(a) && /September|সেপ্টেম্বর|দুইটাই|দুটোতেই/i.test(a), a); await w(1300);

a=await ask("file opening charge koto?");
c("6 file opening answered", /ফাইল|file/i.test(a), a); await w(1300);

a=await ask("CST te kon university ache?");
c("7 university named", /University|Institute|College/i.test(a), a); await w(1300);

a=await ask("office kothay?");
c("8 office address", /Nikunjo/i.test(a)); 
c("8b maps", /maps\.app/i.test(a));

console.log(`\nRESULT: ${pass} pass, ${fail} fail`);
