"""Restore the language entries that the merge collapsed.

The language brochures name no university, only a city, so several different
courses shared the placeholder name and were merged into one. They are
different offers and must stay separate.
"""
import io
import json
import re
import sys

sys.path.insert(0, "scripts")
from _extract_lib import clean_lines, find_hostel, find_intake, find_majors, find_tuition  # noqa: E402

PATH = "data/university-knowledge-v2.json"
d = json.load(io.open(PATH, encoding="utf-8"))

text = io.open("scripts/_pdf_language.txt", encoding="utf-8").read()
pages = text.split("----- PAGE BREAK -----")

CITY_RE = re.compile(r"(?:Location\s*:?\s*|Course\s+(?:in|Program\s+in)\s+|\bin\s+)([A-Z][A-Za-z\- ]{2,28})", re.I)

entries = []
for page in pages:
    lines = clean_lines(page)
    if not lines:
        continue
    blob = " ".join(lines)

    city = None
    m = CITY_RE.search(blob)
    if m:
        city = re.split(r"[,(]", m.group(1))[0].strip()
    if not city:
        m2 = re.search(r"([A-Z][A-Za-z]+)-([A-Z][A-Za-z]+)", blob)
        if m2:
            city = m2.group(2)
    if not city:
        continue
    if re.search(r"^(?:english|chinese|medium)", city, re.I):
        continue

    tuition = find_tuition(lines)
    hostel = find_hostel(lines)
    intake = find_intake(blob)

    majors = ["Chinese Language"]

    entries.append(
        {
            "city": city.strip(),
            "tuition": tuition,
            "hostel": hostel,
            "intake": intake,
        }
    )

print("language pages with a city:", len(entries))
for e in entries:
    print("  ", e["city"], "|", (e["tuition"] or "-")[:30], "|", e["intake"] or "-")

# Drop the placeholder language entries we already have, then add these.
kept = []
for u in d["universities"]:
    has_only_language = all(p["level"] == "language" for p in u["programs"])
    if "to be confirmed" in u["name"] and has_only_language:
        continue
    kept.append(u)

seen_cities = set()
for e in entries:
    city = e["city"]
    key = city.lower()
    if key in seen_cities:
        continue
    seen_cities.add(key)

    name = "University name to be confirmed \u2014 " + city
    existing = next((u for u in kept if u["name"] == name), None)
    prog = {
        "level": "language",
        "teaching_language": "Chinese",
        "duration_years": 1,
        "intake": e["intake"] or "March 2027",
        "age_limit": None,
        "tuition": e["tuition"],
        "hostel": e["hostel"],
        "scholarship": None,
        "majors": ["Chinese Language"],
        "requirements": [],
        "notes": "Chinese language course. The exact university is confirmed by our team.",
    }
    if existing:
        existing["programs"].append(prog)
    else:
        kept.append(
            {
                "name": name,
                "city": city,
                "province": None,
                "ranking": None,
                "programs": [prog],
            }
        )

d["universities"] = kept

with io.open(PATH, "w", encoding="utf-8") as f:
    json.dump(d, f, ensure_ascii=False, indent=2)

unis = d["universities"]
lv = {}
for u in unis:
    for p in u["programs"]:
        lv[p["level"]] = lv.get(p["level"], 0) + 1
print()
print("universities:", len(unis))
print("programmes:", sum(len(u["programs"]) for u in unis))
print("by level:", json.dumps(lv))
