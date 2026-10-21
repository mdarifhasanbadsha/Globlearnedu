"""Build the merged university/programme dataset from the four brochures.

One entry per (university OR city) + level, so a student can be shown examples
by name and by city. Everything is scrubbed of the agency that produced the
brochures.
"""

import io
import json
import re
import sys

sys.path.insert(0, "scripts")
from _extract_lib import (  # noqa: E402
    LEVELS,
    CITY_LINE_RE,
    LOCATION_RE,
    UNIVERSITY_RE,
    clean_lines,
    find_documents,
    find_duration,
    find_hostel,
    find_intake,
    find_language,
    find_majors,
    find_scholarship,
    find_tuition,
    scrub,
)

OUT = "data/university-knowledge-v2.json"
UNKNOWN = "University name to be confirmed"


def split_sections(page_text, default_level):
    """A page may hold one university with several taught-in groups.

    Returns a list of dicts, each a single (name/city + level + language) unit.
    """
    lines = clean_lines(page_text)
    if not lines:
        return []

    # University name, if this page has one.
    name = None
    name_at = None
    for i, ln in enumerate(lines[:6]):
        m = UNIVERSITY_RE.match(ln)
        if m:
            cand = m.group(1).strip(" ,-")
            cand = re.sub(r"\s*[-,]\s*[A-Z][a-z]+$", "", cand).strip()
            if len(cand) > 6:
                name = cand
                name_at = i
                break

    # City. Only real place names — "Location: English Medium" is a language,
    # not a city, and accepting it produced nonsense entries.
    NOT_A_CITY = re.compile(
        r"^(?:english|chinese|english medium|chinese medium|english or chinese|"
        r"institute of|university|college|scholarship|course|program|programme|"
        r"confirm|seats?|available|company|china|asia|all)$",
        re.I,
    )
    KNOWN_CITIES = {
        "chongqing", "yunnan", "hubei", "harbin", "xian", "xi'an", "kunming",
        "nanjing", "taizhou", "guangxi", "hainan", "haikou", "guizhou", "sichuan",
        "changzhou", "changzhou city", "wuhan", "beijing", "shanghai", "tianjin",
        "nanning", "nanchong", "yangzhou", "nantong", "jining", "zibo", "qingdao",
        "shenyang", "liuzhou", "binzhou", "guiyang", "jiangsu", "zhejiang",
        "shaanxi", "anhui", "hunan", "hainan-haikou", "qu jing", "qujing",
        "xuzhou", "suzhou", "hangzhou", "hefei", "zhengzhou", "jinan", "fuzhou",
        "xiamen", "dalian", "changchun", "qingdao", "ningbo", "wuxi", "jiaxing",
        "shaoxing", "huizhou", "zhuhai", "shenzhen", "guangzhou", "chengdu",
        "changsha", "lanzhou", "taiyuan", "shijiazhuang", "nanchang",
    }

    def accept(candidate):
        if not candidate:
            return None
        c = candidate.strip(" ,.-")
        c = re.sub(r"\s+", " ", c)
        if not (2 < len(c) < 30):
            return None
        if NOT_A_CITY.match(c):
            return None
        words = c.split()
        if len(words) > 3:
            return None
        # Title case is required for a city name.
        if not all(w[0].isupper() for w in words if w):
            return None
        return c

    city = province = None
    for ln in lines[:10]:
        m = CITY_LINE_RE.match(ln)
        if m:
            cand = accept(m.group(1))
            if cand:
                city = cand
                province = (m.group(2) or "").strip() or None
                break
    if not city:
        for ln in lines[:10]:
            m = LOCATION_RE.search(ln)
            if m:
                cand = accept(re.split(r"[,(\-]", m.group(1))[0])
                if cand:
                    city = cand
                    break
    # "Chinese Language Course in Chongqing" carries the city in the title.
    if not city:
        for ln in lines[:3]:
            m = re.search(r"\b(?:Course\s+)?in\s+([A-Z][A-Za-z\- ]{2,25})", ln)
            if m:
                cand = accept(m.group(1))
                if cand:
                    city = cand
                    break
    # "Language course in Hainan-Haikou"
    if not city:
        for ln in lines[:3]:
            m = re.search(r"([A-Z][A-Za-z]+)-([A-Z][A-Za-z]+)", ln)
            if m:
                cand = accept(m.group(2))
                if cand:
                    city = cand
                    break

    if not name and not city:
        return []

    intake = find_intake(page_text)

    # Group boundaries: a line that names a level or a language of instruction.
    groups = []
    current = {"label": None, "lines": []}
    for ln in lines:
        if re.match(r"^Documents?\s*:?", ln, re.I):
            current["lines"].append(ln)
            continue
        marker = re.match(
            r"^(?:"
            r"Masters?\s+Scholarship\s*\((English|Chinese)\s*Taught\)|"
            r"Bachelor\s+Degree\s+Taught\s+in\s+(English|Chinese)|"
            r"Bachelor\s+Scholarship|"
            r"Doctoral/PhD\s+Degree\s+scholarship|"
            r"PhD\s+scholarship|"
            r"Masters?\s+Scholarship|"
            r"Chinese\s+Language\s*\+?\s*CSCA\s+Training\s+Course|"
            r"Chinese\s+Language\s+(?:Course|Program)"
            r")",
            ln,
            re.I,
        )
        if marker:
            if current["lines"]:
                groups.append(current)
            current = {"label": ln, "lines": []}
        else:
            current["lines"].append(ln)
    if current["lines"]:
        groups.append(current)

    if not groups:
        groups = [{"label": None, "lines": lines}]

    units = []
    for g in groups:
        label = g["label"] or ""
        low = label.lower()
        body = g["lines"]

        if "language" in low and "taught" not in low:
            level = "language"
        elif "phd" in low or "doctoral" in low:
            level = "phd"
        elif "master" in low:
            level = "master"
        elif "bachelor" in low:
            level = "bachelor"
        else:
            # No label on this page: fall back to the document's own level,
            # but only when the page clearly is that level.
            level = default_level

        lang = find_language(body) or find_language(lines)
        if not lang:
            if "english" in low:
                lang = "English"
            elif "chinese" in low and "taught" in low:
                lang = "Chinese"

        majors = find_majors(body)
        if not majors and level == "language":
            majors = ["Chinese Language"]

        units.append(
            {
                "name": name,
                "city": city,
                "province": province,
                "level": level,
                "teaching_language": lang,
                "duration_years": find_duration(body) or find_duration(lines),
                "intake": intake,
                "tuition": find_tuition(body) or find_tuition(lines),
                "hostel": find_hostel(body) or find_hostel(lines),
                "scholarship": find_scholarship(body) or find_scholarship(lines),
                "majors": list(dict.fromkeys(majors))[:60],
                "documents": find_documents(body),
            }
        )

    return units


def build():
    by_key = {}

    for doc_level, level in LEVELS.items():
        path = f"scripts/_pdf_{doc_level}.txt"
        try:
            text = io.open(path, encoding="utf-8").read()
        except FileNotFoundError:
            print(f"skip {doc_level} (no text)")
            continue

        pages = text.split("----- PAGE BREAK -----")
        for page in pages:
            for unit in split_sections(page, level):
                city = unit["city"]
                name = unit["name"]
                key = (
                    (name or "").lower(),
                    (city or "").lower(),
                    unit["level"],
                    (unit["teaching_language"] or "").lower(),
                )
                if key in by_key:
                    prev = by_key[key]
                    prev["majors"] = list(dict.fromkeys(prev["majors"] + unit["majors"]))
                    for f in ("tuition", "hostel", "scholarship", "duration_years", "intake"):
                        if not prev.get(f) and unit.get(f):
                            prev[f] = unit[f]
                    if unit["documents"] and not prev["documents"]:
                        prev["documents"] = unit["documents"]
                else:
                    by_key[key] = unit

    units = [u for u in by_key.values() if u["majors"] or u["city"]]
    for u in units:
        if u["name"]:
            u["name"] = re.sub(r"\s+(?:and|of|for|the)$", "", u["name"]).strip(" ,-")

    # Shape into the import format the platform already understands.
    universities = {}
    for u in units:
        name = u["name"] or UNKNOWN
        if not u["name"] and u["city"]:
            name = f"{UNKNOWN} — {u['city']}"
        entry = universities.setdefault(
            name,
            {
                "name": name,
                "city": u["city"],
                "province": u["province"],
                "ranking": None,
                "programs": [],
            },
        )
        notes = []
        if u["scholarship"]:
            notes.append(u["scholarship"])
        if u["documents"]:
            notes.append("Documents: " + "; ".join(u["documents"][:15]))
        entry["programs"].append(
            {
                "level": u["level"],
                "teaching_language": u["teaching_language"],
                "duration_years": u["duration_years"],
                "intake": u["intake"],
                "age_limit": None,
                "tuition": scrub(u["tuition"]) or None,
                "hostel": scrub(u["hostel"]) or None,
                "scholarship": scrub(u["scholarship"]) or None,
                "majors": u["majors"],
                "requirements": u["documents"],
                "notes": scrub(" ".join(notes)) or None,
            }
        )

    out = {"universities": list(universities.values())}
    with io.open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    total_prog = sum(len(v["programs"]) for v in universities.values())
    print(f"universities: {len(universities)}")
    print(f"programmes:   {total_prog}")
    print(f"entries:      {len(units)}")
    lv = {}
    for v in universities.values():
        for p in v["programs"]:
            lv[p["level"]] = lv.get(p["level"], 0) + 1
    print("by level:", json.dumps(lv))
    city_only = [v for v in universities.values() if v["name"].startswith(UNKNOWN)]
    print(f"city-only entries: {len(city_only)}")
    for v in city_only[:20]:
        print("   ", v["name"], "|", len(v["programs"]), "prog")
    print(f"written -> {OUT}")


if __name__ == "__main__":
    build()
