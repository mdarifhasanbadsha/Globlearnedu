"""Accept 'Nanjing, Jiangsu' and 'Shanghai' as city lines — no 'city' keyword needed."""
import io

PATH = "scripts/_build2.py"

with io.open(PATH, "r", encoding="utf-8") as f:
    src = f.read()

# Replace city_of entirely with a version that reads the line right after the
# university name, which is how these brochures are laid out.
start = src.find("def city_of(lines):")
end = src.find("GROUP_MARKER = re.compile(")
if start == -1 or end == -1:
    raise SystemExit("city_of not found")

replacement = '''PROVINCES = {
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
    raw = re.sub(r"\\s+", " ", text.strip(" ,.-"))

    # "City, Province" or "City Province"
    m = re.match(r"^([A-Z][A-Za-z'\\- ]{1,25})(?:\\s*,\\s*|\\s+)([A-Z][A-Za-z'\\- ]{1,25})$", raw)
    if m:
        city, second = m.group(1).strip(), m.group(2).strip()
        if city.lower() in CITIES or second.lower() in PROVINCES:
            return city, second if second.lower() in PROVINCES else None

    # A single bare city name.
    if raw.lower() in CITIES:
        return raw, None

    # "Wuhan city, Hubei province"
    m = re.match(
        r"^([A-Z][A-Za-z'\\- ]{1,25}?)\\s*(?:city)?\\s*,?\\s*([A-Z][A-Za-z'\\- ]{1,25})?\\s*(?:province)?$",
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
        m = re.search(r"\\b(?:Course\\s+)?in\\s+([A-Z][A-Za-z\\- ]{2,25})", ln)
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


'''

src = src[:start] + replacement + src[end:]

with io.open(PATH, "w", encoding="utf-8", newline="\n") as f:
    f.write(src)

print("city detection rewritten")
