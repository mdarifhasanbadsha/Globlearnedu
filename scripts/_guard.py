"""Guard split_name_city so a university's own last word is never taken as a city."""
import io

PATH = "scripts/_build2.py"

with io.open(PATH, "r", encoding="utf-8") as f:
    src = f.read()

old = (
    '        if len(head) > 12 and re.search(r"(?:University|College|Institute|Academy)", head, re.I):'
)

new = (
    "        # A university's own last word is part of its name, not a city:\n"
    '        # "Hubei University of Technology" must not become city=Technology.\n'
    "        not_city_word = re.search(\n"
    '            r"(?:Technology|Engineering|Sciences?|Economics|Medicine|Education|"\n'
    '            r"Normal|Finance|Medical|Information|Polytechnic|Arts|Agriculture|"\n'
    '            r"Aviation|Business|Management|Studies|Communication|Nursing|"\n'
    '            r"Pharmacy|Forestry|Mining|Petroleum|Construction|Union)$",\n'
    "            candidate,\n"
    "            re.I,\n"
    "        )\n"
    "        if (\n"
    "            len(head) > 12\n"
    '            and re.search(r"(?:University|College|Institute|Academy)", head, re.I)\n'
    "            and not not_city_word\n"
    "        ):"
)

if "not_city_word" in src:
    print("already guarded")
elif old in src:
    src = src.replace(old, new, 1)
    with io.open(PATH, "w", encoding="utf-8", newline="\n") as f:
        f.write(src)
    print("guarded")
else:
    print("ANCHOR NOT FOUND")
