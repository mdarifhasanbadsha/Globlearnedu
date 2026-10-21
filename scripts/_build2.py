"""Parse with continuation pages merged into the university above them."""
import io
import json
import re
import sys

sys.path.insert(0, "scripts")
from _extract_lib import (  # noqa: E402
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

NOT_A_CITY = re.compile(
    r"^(?:english|chinese|english medium|chinese medium|english or chinese|"
    r"institute of|university|college|scholarship|course|program|programme|"
    r"confirm|seats?|available|company|china|asia|all)$",
    re.I,
)


def accept_city(candidate):
    if not candidate:
        return None
    c = re.sub(r"\s+", " ", candidate.strip(" ,.-"))
    if not (2 < len(c) < 30):
        return None
    if NOT_A_CITY.match(c):
        return None
    words = c.split()
    if len(words) > 3:
        return None
    if not all(w[0].isupper() for w in words if w):
        return None
    return c


CITY_IN_NAME = re.compile(
    r"\s+(?:(?:Bachelor|Master'?s?|PhD|Doctoral)\s+)?(?:Taught\s+in\s+\w+\s*)?"
    r"([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*(?:,\s*([A-Z][a-z]+))?\s*$"
)


def split_name_city(raw):
    """'Hubei University of Technology Wuhan, Hubei' -> ('...Technology', 'Wuhan', 'Hubei').

    Brochure headings often glue the city onto the name. Keeping it there
    produced universities called '... Bachelor Taught in English' with no city,
    which is worse than useless for a student asking about a city.
    """
    name = raw.strip(" ,-")
    city = province = None

    # Drop a trailing degree phrase first.
    name = re.sub(
        r"\s+(?:Bachelor|Master'?s?|PhD|Doctoral)\s+(?:Degree\s+)?(?:Taught\s+in\s+\w+)?\s*$",
        "",
        name,
        flags=re.I,
    ).strip(" ,-")

    m = CITY_IN_NAME.search(name)
    if m:
        candidate = m.group(1).strip()
        # Only split when what precedes still looks like a university name.
        head = name[: m.start()].strip(" ,-")
        # A university's own last word is part of its name, not a city:
        # "Hubei University of Technology" must not become city=Technology.
        not_city_word = re.search(
            r"(?:Technology|Engineering|Sciences?|Economics|Medicine|Education|"
            r"Normal|Finance|Medical|Information|Polytechnic|Arts|Agriculture|"
            r"Aviation|Business|Management|Studies|Communication|Nursing|"
            r"Pharmacy|Forestry|Mining|Petroleum|Construction|Union)$",
            candidate,
            re.I,
        )
        if (
            len(head) > 12
            and re.search(r"(?:University|College|Institute|Academy)", head, re.I)
            and not not_city_word
        ):
            name = head
            city = candidate
            province = (m.group(2) or "").strip() or None
    return name, city, province


def university_name(lines):
    """Read a name that may wrap over two or three lines.

    'Harbin Institute of' / 'Technology, Shenzhen' is one university. Taking
    only the first line produced 'Harbin Institute', which is not a name.
    """
    for i in range(min(4, len(lines))):
        # Try progressively longer joins, longest first so we do not settle for
        # half a name.
        for span in (3, 2, 1):
            if i + span > len(lines):
                continue
            candidate = " ".join(lines[i : i + span]).strip()
            if len(candidate) > 120:
                continue
            m = UNIVERSITY_RE.match(candidate)
            if not m:
                continue
            name = m.group(1).strip(" ,-")
            name = re.sub(r"\s+(?:and|of|for|the)$", "", name).strip(" ,-")
            if len(name) > 6 and not re.match(r"^(?:THE|The)$", name):
                return name
    return None


CITY_IN_NAME = re.compile(
    r"\s+(?:(?:Bachelor|Master'?s?|PhD|Doctoral)\s+)?(?:Taught\s+in\s+\w+\s*)?"
    r"([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*(?:,\s*([A-Z][a-z]+))?\s*$"
)


def split_name_city(raw):
    """'Hubei University of Technology Wuhan, Hubei' -> ('...Technology', 'Wuhan', 'Hubei').

    Brochure headings often glue the city onto the name. Keeping it there
    produced universities called '... Bachelor Taught in English' with no city,
    which is worse than useless for a student asking about a city.
    """
    name = raw.strip(" ,-")
    city = province = None

    # Drop a trailing degree phrase first.
    name = re.sub(
        r"\s+(?:Bachelor|Master'?s?|PhD|Doctoral)\s+(?:Degree\s+)?(?:Taught\s+in\s+\w+)?\s*$",
        "",
        name,
        flags=re.I,
    ).strip(" ,-")

    m = CITY_IN_NAME.search(name)
    if m:
        candidate = m.group(1).strip()
        # Only split when what precedes still looks like a university name.
        head = name[: m.start()].strip(" ,-")
        # A university's own last word is part of its name, not a city:
        # "Hubei University of Technology" must not become city=Technology.
        not_city_word = re.search(
            r"(?:Technology|Engineering|Sciences?|Economics|Medicine|Education|"
            r"Normal|Finance|Medical|Information|Polytechnic|Arts|Agriculture|"
            r"Aviation|Business|Management|Studies|Communication|Nursing|"
            r"Pharmacy|Forestry|Mining|Petroleum|Construction|Union)$",
            candidate,
            re.I,
        )
        if (
            len(head) > 12
            and re.search(r"(?:University|College|Institute|Academy)", head, re.I)
            and not not_city_word
        ):
            name = head
            city = candidate
            province = (m.group(2) or "").strip() or None
    return name, city, province


def university_name(lines):
    """A name may wrap over two lines: 'Harbin Institute of' / 'Technology'."""
    for i in range(min(4, len(lines))):
        joined = lines[i]
        for extra in (1, 2):
            if i + extra < len(lines):
                candidate = joined + " " + lines[i + extra]
                m = UNIVERSITY_RE.match(candidate.strip())
                if m:
                    n = re.sub(r"\s+(?:and|of|for|the)$", "", m.group(1).strip(" ,-")).strip(" ,-")
                    return n
        m = UNIVERSITY_RE.match(joined)
        if m:
            n = m.group(1).strip(" ,-")
            n = re.sub(r"\s+(?:and|of|for|the)$", "", n).strip(" ,-")
            if len(n) > 6:
                return n
    return None


PROVINCES = {
    "anhui", "fujian", "gansu", "guangdong", "guizhou", "hainan", "hebei",
    "heilongjiang", "henan", "hubei", "hunan", "jiangsu", "jiangxi", "jilin",
    "liaoning", "qinghai", "shaanxi", "shandong", "shanxi", "sichuan", "yunnan",
    "zhejiang", "guangxi", "inner mongolia", "ningxia", "xinjiang", "tibet",
}

# Major cities, so a single bare word can be trusted as a location.
CITIES = {
    "beijing", "shanghai", "tianjin", "chongqing", "wuhan", "nanjing", "harbin",
    "guangzhou", "shenzhen", "chengdu", "hangzhou", "xian", "xi'an", "jinan",
    "zhengzhou", "changsha", "hefei", "fuzhou", "xiamen", "dalian", "shenyang",
    "changchun", "kunming", "nanning", "guiyang", "lanzhou", "taiyuan",
    "shijiazhuang", "nanchang", "yangzhou", "nantong", "changzhou", "taizhou",
    "wuxi", "suzhou", "ningbo", "jiaxing", "shaoxing", "zibo", "jining",
    "qingdao", "liuzhou", "binzhou", "nanchong", "xuzhou", "huizhou", "zhuhai",
    "qujing", "qu jing", "haikou", "sanya", "zhanjiang", "mianyang", "baoding",
    "langfang", "yanbian", "yanji", "dandong", "qiqihar", "daqing", "anshan",
    "fushun", "benxi", "huzhou", "quzhou", "zhoushan", "taian", "weifang",
    "yantai", "linyi", "dezhou", "liaocheng", "hengyang", "zhuzhou", "xiangtan",
    "yueyang", "changde", "ganzhou", "jiujiang", "yichang", "xiangyang",
    "jingzhou", "huangshi", "shiyan", "kaifeng", "luoyang", "xinyang",
    "nanyang", "baotou", "ordos", "yinchuan", "xining", "urumqi", "lhasa",
}


def looks_like_place(text):
    """Is this line a location? 'Nanjing, Jiangsu' and 'Shanghai' both are."""
    if not text:
        return None, None
    raw = re.sub(r"\s+", " ", text.strip(" ,.-"))

    # "City, Province" or "City Province"
    m = re.match(r"^([A-Z][A-Za-z'\- ]{1,25})(?:\s*,\s*|\s+)([A-Z][A-Za-z'\- ]{1,25})$", raw)
    if m:
        city, second = m.group(1).strip(), m.group(2).strip()
        if city.lower() in CITIES or second.lower() in PROVINCES:
            return city, second if second.lower() in PROVINCES else None

    # A single bare city name.
    if raw.lower() in CITIES:
        return raw, None

    # "Wuhan city, Hubei province"
    m = re.match(
        r"^([A-Z][A-Za-z'\- ]{1,25}?)\s*(?:city)?\s*,?\s*([A-Z][A-Za-z'\- ]{1,25})?\s*(?:province)?$",
        raw,
        re.I,
    )
    if m:
        city = (m.group(1) or "").strip()
        prov = (m.group(2) or "").strip()
        if city.lower() in CITIES or prov.lower() in PROVINCES:
            return city, prov or None

    return None, None


def city_of(lines):
    # The brochure puts the location directly under the university name.
    for ln in lines[:10]:
        m = CITY_LINE_RE.match(ln)
        if m:
            c = accept_city(m.group(1))
            if c:
                return c, (m.group(2) or "").strip() or None

        c, p = looks_like_place(ln)
        if c:
            return c, p

        m = LOCATION_RE.search(ln)
        if m:
            got = accept_city(re.split(r"[,(]", m.group(1))[0])
            if got:
                return got, None

    for ln in lines[:3]:
        m = re.search(r"\b(?:Course\s+)?in\s+([A-Z][A-Za-z\- ]{2,25})", ln)
        if m:
            got = accept_city(m.group(1))
            if got:
                return got, None
    for ln in lines[:3]:
        m = re.search(r"([A-Z][A-Za-z]+)-([A-Z][A-Za-z]+)", ln)
        if m:
            got = accept_city(m.group(2))
            if got:
                return got, None
    return None, None


GROUP_MARKER = re.compile(
    r"^(?:"
    r"Masters?\s+Scholarship\s*\((English|Chinese)\s*Taught\)|"
    r"Bachelor\s+Degree\s+Taught\s+in\s+(English|Chinese)|"
    r"\(?0\.5\+\d\)?\s*Bachelor\s+Degree\s+Scholarship[^\n]*|"
    r"Bachelor\s+Scholarship[^\n]*|"
    r"Doctoral/PhD\s+Degree\s+scholarship[^\n]*|"
    r"PhD\s+scholarship[^\n]*|"
    r"PhD\s+Degree\s+scholarship[^\n]*|"
    r"Masters?\s+Scholarship[^\n]*|"
    r"Chinese\s+Language\s*\+\s*CSCA\s+Training\s+Course|"
    r"Chinese\s+Language\s+(?:Course|Program)[^\n]*"
    r")",
    re.I,
)


def level_from_label(label, default_level):
    low = (label or "").lower()
    if "language" in low and "taught" not in low:
        return "language"
    if "phd" in low or "doctoral" in low:
        return "phd"
    if "master" in low:
        return "master"
    if "bachelor" in low:
        return "bachelor"
    return default_level


def parse_unit(name, city, province, page_text, default_level):
    lines = clean_lines(page_text)
    if not lines:
        return []

    intake = find_intake(page_text)

    groups = []
    current = {"label": None, "lines": []}
    for ln in lines:
        if GROUP_MARKER.match(ln):
            if current["lines"]:
                groups.append(current)
            current = {"label": ln, "lines": [ln]}
        else:
            current["lines"].append(ln)
    if current["lines"]:
        groups.append(current)

    if not groups:
        groups = [{"label": None, "lines": lines}]

    units = []
    for g in groups:
        label = g["label"] or ""
        body = g["lines"]
        level = level_from_label(label, default_level)

        lang = find_language(body) or find_language(lines)
        if not lang:
            low = label.lower()
            if "english" in low:
                lang = "English"
            elif "chinese" in low and "taught" in low:
                lang = "Chinese"

        majors = find_majors(body)
        if not majors and level == "language":
            majors = ["Chinese Language"]

        if not majors and level != "language":
            # A page with no numbered majors still tells us the level exists.
            majors = []

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
                "majors": list(dict.fromkeys(majors))[:80],
                "documents": find_documents(body),
            }
        )
    return units


def build():
    by_key = {}
    doc_levels = {"bachelor": "bachelor", "language": "language", "master": "master", "phd": "phd"}

    for doc, level in doc_levels.items():
        try:
            text = io.open("scripts/_pdf_%s.txt" % doc, encoding="utf-8").read()
        except FileNotFoundError:
            continue

        pages = text.split("----- PAGE BREAK -----")

        # A page with no name of its own continues the university above it.
        carry_name = carry_city = carry_prov = None
        for page_text in pages:
            lines = clean_lines(page_text)
            if not lines:
                continue

            name = university_name(lines)
            city, province = city_of(lines)

            if name:
                name, name_city, name_prov = split_name_city(name)
                city = city or name_city
                province = province or name_prov
                carry_name, carry_city, carry_prov = name, city, province
                use_name, use_city, use_prov = name, city, province
            else:
                use_name, use_city, use_prov = carry_name, city or carry_city, province or carry_prov

            if not use_name and not use_city:
                continue

            for unit in parse_unit(use_name, use_city, use_prov, page_text, level):
                key = (
                    (unit["name"] or "").lower(),
                    (unit["city"] or "").lower(),
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

    units = [u for u in by_key.values() if u["majors"]]

    universities = {}
    for u in units:
        if u["name"]:
            name = re.sub(r"\s+(?:and|of|for|the)$", "", u["name"]).strip(" ,-")
            name = re.sub(r"\s+(?:PhD|Doctoral|Masters?|Bachelor)\s+(?:scholarship|degree).*$", "", name, flags=re.I).strip(" ,-")
        else:
            name = "%s \u2014 %s" % (UNKNOWN, u["city"])
        entry = universities.setdefault(
            name,
            {"name": name, "city": u["city"], "province": u["province"], "ranking": None, "programs": []},
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

    lv = {}
    total_majors = 0
    for v in universities.values():
        for p in v["programs"]:
            lv[p["level"]] = lv.get(p["level"], 0) + 1
            total_majors += len(p["majors"])
    print("universities: %d" % len(universities))
    print("programmes:   %d" % sum(lv.values()))
    print("majors:       %d" % total_majors)
    print("by level:     %s" % json.dumps(lv))
    print("city-only:    %d" % len([v for v in universities.values() if v["name"].startswith(UNKNOWN)]))
    print("written ->    %s" % OUT)


if __name__ == "__main__":
    build()
