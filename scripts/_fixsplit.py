"""Fix name/city split: 'X University Wuhan, Hubei' should be name=University, city=Wuhan."""
import io

PATH = "scripts/_build2.py"

with io.open(PATH, "r", encoding="utf-8") as f:
    src = f.read()

# 1. After finding a university name, strip any trailing city/province text and
#    use it as the city when the page itself did not provide one.
old = '''def university_name(lines):
    """A name may wrap over two lines: 'Harbin Institute of' / 'Technology'."""'''
new = '''CITY_IN_NAME = re.compile(
    r"\\s+(?:(?:Bachelor|Master'?s?|PhD|Doctoral)\\s+)?(?:Taught\\s+in\\s+\\w+\\s*)?"
    r"([A-Z][a-z]+(?:\\s+[A-Z][a-z]+)?)\\s*(?:,\\s*([A-Z][a-z]+))?\\s*$"
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
        r"\\s+(?:Bachelor|Master'?s?|PhD|Doctoral)\\s+(?:Degree\\s+)?(?:Taught\\s+in\\s+\\w+)?\\s*$",
        "",
        name,
        flags=re.I,
    ).strip(" ,-")

    m = CITY_IN_NAME.search(name)
    if m:
        candidate = m.group(1).strip()
        # Only split when what precedes still looks like a university name.
        head = name[: m.start()].strip(" ,-")
        if len(head) > 12 and re.search(r"(?:University|College|Institute|Academy)", head, re.I):
            name = head
            city = candidate
            province = (m.group(2) or "").strip() or None
    return name, city, province


def university_name(lines):
    """A name may wrap over two lines: 'Harbin Institute of' / 'Technology'."""'''
if old in src:
    src = src.replace(old, new, 1)
    print("added split_name_city")
else:
    print("ANCHOR 1 NOT FOUND")

# 2. Use it wherever a name is returned.
src = src.replace(
    '                if m:\n                    n = m.group(1).strip(" ,-")\n                    return re.sub(r"\\s+(?:and|of|for|the)$", "", n).strip(" ,-")',
    '                if m:\n                    n = re.sub(r"\\s+(?:and|of|for|the)$", "", m.group(1).strip(" ,-")).strip(" ,-")\n                    return n',
    1,
)

# 3. Apply the split in build() where the carry name is used.
src = src.replace(
    "            if name:\n                carry_name, carry_city, carry_prov = name, city, province\n                use_name, use_city, use_prov = name, city, province",
    "            if name:\n                name, name_city, name_prov = split_name_city(name)\n                city = city or name_city\n                province = province or name_prov\n                carry_name, carry_city, carry_prov = name, city, province\n                use_name, use_city, use_prov = name, city, province",
    1,
)

# 4. Clean the final display name too.
src = src.replace(
    '        if u["name"]:\n            name = re.sub(r"\\s+(?:and|of|for|the)$", "", u["name"]).strip(" ,-")',
    '        if u["name"]:\n            name = re.sub(r"\\s+(?:and|of|for|the)$", "", u["name"]).strip(" ,-")\n            name = re.sub(r"\\s+(?:PhD|Doctoral|Masters?|Bachelor)\\s+(?:scholarship|degree).*$", "", name, flags=re.I).strip(" ,-")',
    1,
)

with io.open(PATH, "w", encoding="utf-8", newline="\n") as f:
    f.write(src)

print("patched")
