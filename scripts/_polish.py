"""Final polish of city names, then write the import-ready file."""
import io
import json
import re

PATH = "data/university-knowledge-v2.json"
d = json.load(io.open(PATH, encoding="utf-8"))

CLEAN = {
    "chongqing course duration": "Chongqing",
    "zhejiang province": "Zhejiang",
    "guangxi march intake": "Guangxi",
    "hainan-haikou": "Haikou",
    "nanjing city march": "Nanjing",
    "harbin": "Harbin",
}

for u in d["universities"]:
    city = u.get("city")
    if city:
        key = city.lower().strip()
        if key in CLEAN:
            city = CLEAN[key]
        # Trim trailing noise words.
        city = re.sub(r"\s+(?:City|Province|March|Intake|Course|Program|duration)\s*$", "", city, flags=re.I).strip()
        u["city"] = city or None
        if "to be confirmed" in u["name"] and city:
            u["name"] = "University name to be confirmed \u2014 " + city

    # Normalise the apostrophe in Xi'an.
    if u.get("city"):
        u["city"] = u["city"].replace("\u2019", "'")
    u["name"] = u["name"].replace("Xi\u2019an", "Xi'an")

# Merge duplicate city placeholders created by the cleanup.
merged = {}
for u in d["universities"]:
    sig = (u["name"], (u.get("city") or "").lower())
    if sig in merged:
        merged[sig]["programs"].extend(u["programs"])
    else:
        merged[sig] = u
d["universities"] = list(merged.values())

# Drop any programme with no majors at all — nothing to offer.
for u in d["universities"]:
    u["programs"] = [p for p in u["programs"] if p.get("majors")]
d["universities"] = [u for u in d["universities"] if u["programs"]]

with io.open(PATH, "w", encoding="utf-8") as f:
    json.dump(d, f, ensure_ascii=False, indent=2)

# Summary by level, with a sample.
unis = d["universities"]
lv = {}
for u in unis:
    for p in u["programs"]:
        lv[p["level"]] = lv.get(p["level"], 0) + 1

print("=" * 62)
print("FINAL DATA")
print("=" * 62)
print("universities :", len(unis))
print("programmes   :", sum(lv.values()))
print("majors       :", sum(len(p["majors"]) for u in unis for p in u["programs"]))
print("with city    :", len([u for u in unis if u.get("city")]))
print("city-only    :", len([u for u in unis if "to be confirmed" in u["name"]]))
print("by level     :", json.dumps(lv))
print()

for level in ("language", "bachelor", "master", "phd"):
    print("--- %s ---" % level.upper())
    for u in unis:
        for p in u["programs"]:
            if p["level"] == level:
                print(
                    "  %-46s %-12s %3d majors  %s"
                    % (
                        u["name"][:46],
                        (u.get("city") or "-")[:12],
                        len(p["majors"]),
                        (p.get("tuition") or "-")[:22],
                    )
                )
    print()

# Prove no agency information survived anywhere.
blob = json.dumps(d, ensure_ascii=False)
AGENCY = re.compile(r"rk\s*edu|therkedu|admission@|applynow|wechat|1858118", re.I)
print("agency residue:", "NONE" if not AGENCY.search(blob) else AGENCY.search(blob).group(0))
