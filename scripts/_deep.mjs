/**
 * Three long, realistic conversations against the LIVE production API.
 *
 * Each one exercises the full journey the owner cares about: a new student
 * arriving, learning, testing the assistant, and either leaving a contact or
 * walking away. Every turn is printed so the replies can be read as a student
 * would read them.
 */

const BASE = "https://globlearnedu.com/api/public/chat";

async function conversation(id, title, turns) {
  console.log("\n" + "=".repeat(78));
  console.log(`${title}`);
  console.log("=".repeat(78));

  let token = "";
  const transcript = [];

  for (const m of turns) {
    const res = await fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ message: m, token }),
    });
    let reply = "[HTTP ERROR]";
    if (res.ok) {
      const j = JSON.parse(await res.text());
      if (j.token) token = j.token;
      reply = j.reply === null || j.reply === undefined ? "(silent)" : String(j.reply);
    }
    console.log(`\n  S: ${m}`);
    console.log(`  A: ${reply}`);
    transcript.push({ student: m, bot: reply });
    await new Promise((r) => setTimeout(r, 1300));
  }

  const { writeFileSync } = await import("node:fs");
  writeFileSync(`scripts/_conv${id}.json`, JSON.stringify(transcript, null, 2), "utf8");
  return transcript;
}

// ── Conversation 1: Diploma, genuine student, walks the whole funnel ──
await conversation(1, "CONVERSATION 1 — Diploma student, completes the funnel", [
  "assalamu alaikum vai",
  "ami diploma korte chai china te",
  "CST division",
  "amar SSC 4.20, HSC 3.85, 2021 e pass",
  "khoroch kemon hobe?",
  "ei taka ami ek bare dite parbo na",
  "thik ache. documents ki ki lage?",
  "amar passport nei ekhono",
  "apnader office kothay? dekhate chai",
]);

// ── Conversation 2: Bachelor, skeptical, tests the bot ──
await conversation(2, "CONVERSATION 2 — Bachelor student, sceptical, tests for a bot", [
  "hi",
  "tumi ki bot? manus na?",
  "give me a python program to check",
  "ok whatever. AI te bachelor korte chai",
  "amar result 5.00, 2023",
  "onek taka lagbe? amar kache beshi taka nai",
  "onno agency 50 hazar ney keno apnara 99 hazar?",
  "ai ta ki sotti free scholarship diye dibe? guarantee ache?",
  "amar number 01898765432 rakhben",
]);

// ── Conversation 3: Master's, abrupt, impatient ──
await conversation(3, "CONVERSATION 3 — Master student, impatient, hostile", [
  "fee koto",
  "bolen na kichu, chup keno?",
  "tumi to ekta pagol bot, kichu bujho na",
  "ei amake shorashori bolen ta hole ki kore admission nibo",
  "bhalo, tar por?",
  "amar result 3.20 CSE te, 4 er moddhe",
  "amar phone 01911223344",
  "dhonnobad",
]);
