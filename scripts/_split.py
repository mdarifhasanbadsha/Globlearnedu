"""Merge duplicates, then split into small import batches."""
import io
import json
import re

SRC = "data/university-knowledge-v2.json"
FULL = "data/university-knowledge-v3.json"
OUTDIR = r"C:\Users\mdari\Downloads"

d = json.load(io.open(SRC, encoding="utf-8"))

# ── merge programmes with the same (name, level, language) ─────────────
by_uni = {}
for u in d["universities"]:
    key = u["name"].lower()
    if key not in by_uni:
        by_uni[key] = {
            "name": u["name"],
            "city": u.get("city"),
            "province": u.get("province"),
            "ranking": None,
            "programs": [],
        }
    tgt = by_uni[key]
    if not tgt.get("city") and u.get("city"):
        tgt["city"] = u["city"]
    if not tgt.get("province") and u.get("province"):
        tgt["province"] = u["province"]

    for p in u["programs"]:
        sig = (p["level"], (p.get("teaching_language") or "").lower())
        existing = None
        for q in tgt["programs"]:
            if (q["level"], (q.get("teaching_language") or "").lower()) == sig:
                existing = q
                break
        if existing:
            existing["majors"] = list(dict.fromkeys(existing["majors"] + p.get("majors", [])))
            for f in ("tuition", "hostel", "scholarship", "duration_years", "intake", "notes"):
                if not existing.get(f) and p.get(f):
                    existing[f] = p[f]
            if p.get("requirements") and not existing.get("requirements"):
                existing["requirements"] = p["requirements"]
        else:
            tgt["programs"].append(dict(p))

unis = list(by_uni.values())

# ── level order for the batches: the ladder a student climbs ──────────
ORDER = ["language", "bachelor", "master", "phd"]


def rank(u):
    levels = [p["level"] for p in u["programs"]]
    for i, lv in enumerate(ORDER):
        if lv in levels:
            return i
    return len(ORDER)


unis.sort(key=lambda u: (rank(u), (u.get("city") or "zzz"), u["name"].lower()))

full = {"universities": unis}
with io.open(FULL, "w", encoding="utf-8") as f:
    json.dump(full, f, ensure_ascii=False, indent=2)

lv = {}
for u in unis:
    for p in u["programs"]:
        lv[p["level"]] = lv.get(p["level"], 0) + 1

print("=" * 60)
print("MERGED")
print("=" * 60)
print("universities:", len(unis))
print("programmes  :", sum(lv.values()))
print("majors      :", sum(len(p["majors"]) for u in unis for p in u["programs"]))
print("by level    :", json.dumps(lv))
print("with city   :", len([u for u in unis if u.get("city")]))
print()

# ── split into batches of at most 8 universities ───────────────────────
BATCH = 8
batches = [unis[i : i + BATCH] for i in range(0, len(unis), BATCH)]

cleanup = []
for i, chunk in enumerate(batches, start=1):
    payload = {"universities": chunk}
    path = "%s\\unis_v3_part%d.json" % (OUTDIR, i)
    with io.open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    size = len(json.dumps(payload, ensure_ascii=False).encode("utf-8"))
    prog = sum(len(u["programs"]) for u in chunk)
    cleanup.append(path)
    print("part%d: %2d universities, %2d programmes, %5.1f KB" % (i, len(chunk), prog, size / 1024))
    for u in chunk:
        print("        %s%s" % (u["name"][:52], "" if u.get("city") else "   (no city)"))

# Remove the earlier split files so there is no confusion about which to use.
import os

for old in ["unis_batch1.json", "unis_batch2.json", "unis_batch3.json", "unis_batch4.json",
            "universities-import.json"]:
    p = os.path.join(OUTDIR, old)
    if os.path.exists(p):
        os.remove(p)
        print("removed old:", old)

blob = json.dumps(full, ensure_ascii=False)
AGENCY = re.compile(r"rk\s*edu|therkedu|admission@|applynow|wechat|1858118", re.I)
print()
print("agency residue:", "NONE" if not AGENCY.search(blob) else AGENCY.search(blob).group(0))
print("full file:", FULL)
