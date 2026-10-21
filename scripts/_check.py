"""Quality check on the extracted data: names, cities, agencies, majors."""
import io
import json
import re

d = json.load(io.open("data/university-knowledge-v2.json", encoding="utf-8"))
unis = d["universities"]

AGENCY = re.compile(r"rk\s*edu|therkedu|admission@|applynow|wechat|1858118|chongqing-400000", re.I)

print("=== agency residue ===")
bad = []
for u in unis:
    blob = json.dumps(u, ensure_ascii=False)
    m = AGENCY.search(blob)
    if m:
        bad.append((u["name"], m.group(0)))
print("entries with agency residue:", len(bad))
for n, m in bad[:10]:
    print("   ", n, "->", m)

print("\n=== cities ===")
no_city = [u for u in unis if not u["city"]]
print("without city:", len(no_city), "/", len(unis))
for u in no_city[:12]:
    print("   ", u["name"][:60])

print("\n=== suspicious names ===")
for u in unis:
    n = u["name"]
    if re.search(r"\d{3}|intake|scholarship|documents|^\W", n, re.I):
        print("   SUSPECT:", n)

print("\n=== sample entries ===")
for u in unis[:4]:
    print("\n--", u["name"], "|", u["city"], "|", u["province"])
    for p in u["programs"]:
        print("     %-9s %-8s %3d majors  %s" % (
            p["level"],
            (p["teaching_language"] or "-")[:8],
            len(p["majors"]),
            (p["tuition"] or "-")[:32],
        ))

print("\n=== city-only entries ===")
for u in unis:
    if u["name"].startswith("University name to be confirmed"):
        print("   ", u["name"], "|", [p["level"] for p in u["programs"]])

print("\n=== by level ===")
lv = {}
for u in unis:
    for p in u["programs"]:
        lv[p["level"]] = lv.get(p["level"], 0) + 1
print(json.dumps(lv))
