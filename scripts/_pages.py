"""Show every page's opening line, to find what the parser misses."""
import io

for k in ["bachelor", "master", "phd", "language"]:
    t = io.open("scripts/_pdf_%s.txt" % k, encoding="utf-8").read()
    pages = t.split("----- PAGE BREAK -----")
    print("--- %s: %d pages ---" % (k, len(pages)))
    for i, p in enumerate(pages):
        first = [l.strip() for l in p.strip().split("\n") if l.strip()][:1]
        label = first[0][:65] if first else "(EMPTY PAGE)"
        print("  p%-2d %s" % (i, label))
