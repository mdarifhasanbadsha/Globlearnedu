"""Fix the last two name problems and confirm the final counts."""
import io
import json
import re

PATH = "data/university-knowledge-v2.json"
d = json.load(io.open(PATH, encoding="utf-8"))

for u in d["universities"]:
    name = u["name"]
    city = u.get("city")

    # "University name to be confirmed —" with nothing after it.
    if name.rstrip().endswith("\u2014"):
        name = name.rstrip().rstrip("\u2014").strip(" ,-")
        if city:
            name = "University name to be confirmed \u2014 " + city
        u["name"] = name

    # City stored in place of a city: "Chinese Language Course in".
    if city and re.search(r"Course|Program|Language", city, re.I):
        m = re.search(r"in\s+([A-Z][A-Za-z\- ]{2,25})", city)
        u["city"] = m.group(1).strip() if m else "Zhejiang"

    # Shorten the long Nanjing name so it stays readable in a chat bubble.
    if u["name"].startswith("Nanjing University of Information Science & Technology"):
        u["name"] = "Nanjing University of Information Science & Technology (NUIST)"

# Merge any duplicates the renaming just created.
merged = {}
for u in d["universities"]:
    k = u["name"].lower()
    if k in merged:
        merged[k]["programs"].extend(u["programs"])
        merged[k]["city"] = merged[k].get("city") or u.get("city")
    else:
        merged[k] = u
d["universities"] = list(merged.values())

with io.open(PATH, "w", encoding="utf-8") as f:
    json.dump(d, f, ensure_ascii=False, indent=2)

unis = d["universities"]
print("FINAL universities:", len(unis))
print("FINAL programmes:", sum(len(u["programs"]) for u in unis))
print("FINAL majors:", sum(len(p["majors"]) for u in unis for p in u["programs"]))
print("with city:", len([u for u in unis if u.get("city")]))
lv = {}
for u in unis:
    for p in u["programs"]:
        lv[p["level"]] = lv.get(p["level"], 0) + 1
print("by level:", json.dumps(lv))
print("city-only:", len([u for u in unis if "to be confirmed" in u["name"]]))
