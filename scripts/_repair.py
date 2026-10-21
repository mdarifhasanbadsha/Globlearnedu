"""Repair the few names that were cut short, using the raw page text."""
import io
import json
import re

PDFS = {
    "bachelor": "scripts/_pdf_bachelor.txt",
    "master": "scripts/_pdf_master.txt",
    "phd": "scripts/_pdf_phd.txt",
    "language": "scripts/_pdf_language.txt",
}

# Names that clearly continue on the following line in the brochure.
FIXUPS = {
    "Nanjing University of Information": [
        "Nanjing University of Information Science & Technology - NUIST",
    ],
    "Nanjing University of Information Science": [
        "Nanjing University of Information Science & Technology - NUIST",
    ],
    "Nanjing University of Information Science & Technology- NUIST": [
        "Nanjing University of Information Science & Technology - NUIST",
    ],
    "Nanjing University of Posts": [
        "Nanjing University of Posts and Telecommunications",
    ],
    "Wuhan Institute": [
        "Wuhan Institute of Technology",
    ],
    "Harbin Institute": [
        "Harbin Institute of Technology, Shenzhen",
    ],
    "China University": [
        "China University of Petroleum, Beijing",
    ],
    "Hubei University": [
        "Hubei University of Technology",
    ],
    "Southwest University of Science and Technology Mianyang City": [
        "Southwest University of Science and Technology",
    ],
    "Southwest University of Science Technology": [
        "Southwest University of Science and Technology",
    ],
    "Anhui University of science and technology": [
        "Anhui University of Science and Technology",
    ],
    "University name to be confirmed \u2014 Chinese Language Course in": [
        "University name to be confirmed \u2014 Zhejiang",
    ],
    "Hubei University of Education Wuhan City": [
        "Hubei University of Education",
    ],
}

PATH = "data/university-knowledge-v2.json"
d = json.load(io.open(PATH, encoding="utf-8"))

merged = {}
for u in d["universities"]:
    name = u["name"]

    if name in FIXUPS:
        name = FIXUPS[name][0]
        u["name"] = name

    # Title-case names that came through lowercase.
    if name and name == name.lower() or re.search(r"\b(of|science|technology|and)\b", name):
        words = []
        for w in name.split():
            if w.isupper() and len(w) <= 4:
                words.append(w)
            elif w.lower() in {"of", "and", "the", "for"}:
                words.append(w.lower())
            else:
                words.append(w[:1].upper() + w[1:] if w else w)
        u["name"] = " ".join(words)
        name = u["name"]

    # Drop a trailing city that is already stored separately.
    if u.get("city"):
        city = u["city"]
        for suffix in (" " + city + " City", ", " + city, " " + city):
            if name.endswith(suffix):
                name = name[: -len(suffix)].strip(" ,-")
                u["name"] = name
                break

    key = name.lower()
    if key in merged:
        merged[key]["programs"].extend(u["programs"])
        if not merged[key].get("city") and u.get("city"):
            merged[key]["city"] = u["city"]
    else:
        merged[key] = u

d["universities"] = list(merged.values())

# Deduplicate programmes within each university by level + language.
for u in d["universities"]:
    seen = {}
    for p in u["programs"]:
        k = (p["level"], (p.get("teaching_language") or "").lower())
        if k in seen:
            seen[k]["majors"] = list(dict.fromkeys(seen[k]["majors"] + p.get("majors", [])))
        else:
            seen[k] = p
    u["programs"] = list(seen.values())

with io.open(PATH, "w", encoding="utf-8") as f:
    json.dump(d, f, ensure_ascii=False, indent=2)

unis = d["universities"]
print("universities:", len(unis))
print("programmes:", sum(len(u["programs"]) for u in unis))
print("with city:", len([u for u in unis if u.get("city")]))
print()
for u in unis:
    print("  %-58s %-14s %s" % (u["name"][:58], u.get("city") or "-", [p["level"] for p in u["programs"]]))
