"""Final name cleanups: strip 'City' suffixes, fix 'Course in X' leftovers."""
import io
import json
import re

PATH = "data/university-knowledge-v2.json"

d = json.load(io.open(PATH, encoding="utf-8"))
unis = d["universities"]

OUT = []
seen = {}

for u in unis:
    name = u["name"]
    city = u["city"]
    province = u["province"]

    # "Hubei University of Education Wuhan City" -> name + city
    m = re.match(r"^(.+?(?:University|College|Institute|Academy))\s+([A-Z][a-z]+)\s+City$", name)
    if m:
        name = m.group(1).strip()
        city = city or m.group(2).strip()

    # "University name to be confirmed — Chinese Language Course in" -> use city
    if name.startswith("University name to be confirmed"):
        m2 = re.search(r"Course\s+(?:in\s+)?([A-Z][A-Za-z\- ]{2,25})$", name)
        if m2 and not city:
            city = m2.group(1).strip()
        if city:
            name = "University name to be confirmed \u2014 " + city
        else:
            name = "University name to be confirmed"

    # Trailing degree words that slipped in.
    name = re.sub(
        r"\s+(?:Bachelor|Masters?|PhD|Doctoral)\s+(?:Degree\s+)?(?:Taught\s+in\s+\w+)?\s*$",
        "",
        name,
        flags=re.I,
    ).strip(" ,-")
    name = re.sub(r"\s+(?:and|of|for|the)$", "", name).strip(" ,-")

    u["name"] = name
    u["city"] = city
    u["province"] = province

    key = name.lower()
    if key in seen:
        seen[key]["programs"].extend(u["programs"])
    else:
        seen[key] = u
        OUT.append(u)

d["universities"] = OUT

with io.open(PATH, "w", encoding="utf-8") as f:
    json.dump(d, f, ensure_ascii=False, indent=2)

print("universities:", len(OUT))
print("programmes:", sum(len(u["programs"]) for u in OUT))
print("with city:", len([u for u in OUT if u["city"]]))
print()
for u in OUT:
    print("  %-48s %-14s %s" % (u["name"][:48], u["city"] or "-", [p["level"] for p in u["programs"]]))
