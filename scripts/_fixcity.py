"""Refine city detection: only accept real place names."""
import io
import re

PATH = "scripts/_build_uni.py"

with io.open(PATH, "r", encoding="utf-8") as f:
    src = f.read()

# Replace the city block with a stricter one.
start = src.find("    # City.")
end = src.find("    if not name and not city:")
if start == -1 or end == -1:
    raise SystemExit("city block not found")

replacement = '''    # City. Only real place names — "Location: English Medium" is a language,
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
        c = re.sub(r"\\s+", " ", c)
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
                cand = accept(re.split(r"[,(\\-]", m.group(1))[0])
                if cand:
                    city = cand
                    break
    # "Chinese Language Course in Chongqing" carries the city in the title.
    if not city:
        for ln in lines[:3]:
            m = re.search(r"\\b(?:Course\\s+)?in\\s+([A-Z][A-Za-z\\- ]{2,25})", ln)
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

'''

src = src[:start] + replacement + src[end:]

# Also require majors for named universities, and clean trailing prepositions.
src = src.replace(
    '    units = [u for u in by_key.values() if u["majors"] or u["city"]]',
    '    units = [u for u in by_key.values() if u["majors"] or u["city"]]\n'
    '    for u in units:\n'
    '        if u["name"]:\n'
    '            u["name"] = re.sub(r"\\s+(?:and|of|for|the)$", "", u["name"]).strip(" ,-")',
    1,
)

with io.open(PATH, "w", encoding="utf-8", newline="\n") as f:
    f.write(src)

print("city detection tightened")
