"""Join wrapped university names across lines, then rebuild."""
import io

PATH = "scripts/_build2.py"

with io.open(PATH, "r", encoding="utf-8") as f:
    src = f.read()

start = src.find("def university_name(lines):")
end = src.find("CITY_IN_NAME = re.compile(")
if start == -1 or end == -1:
    raise SystemExit("university_name not found")

replacement = '''def university_name(lines):
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
            name = re.sub(r"\\s+(?:and|of|for|the)$", "", name).strip(" ,-")
            if len(name) > 6 and not re.match(r"^(?:THE|The)$", name):
                return name
    return None


'''

src = src[:start] + replacement + src[end:]

with io.open(PATH, "w", encoding="utf-8", newline="\n") as f:
    f.write(src)

print("university_name rewritten")
