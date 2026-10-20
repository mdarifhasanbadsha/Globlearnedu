"""Render PDF pages to images for vision-based extraction.

Only GL Education content survives: the vision prompt is told to ignore
any agency branding, contacts or headers.
"""
import pymupdf, sys, os, json

sys.stdout.reconfigure(encoding="utf-8")

BASE = r"C:\Users\mdari\Documents\xwechat_files\wxid_ufskg89pvd1922_c969\msg\file\2026-10"
FILES = {
    "bachelor": "Bachelor March 2027 Intake- The RK Edu(1).pdf",
    "language": "Language offer March 2027 The RK Edu(1).pdf",
    "master": "Master's September 2027 intake- The RK EDU(1).pdf",
    "phd": "PhD university list- Sep 2027- The RK Edu(1).pdf",
}

OUT = "scripts/_pages"
os.makedirs(OUT, exist_ok=True)

manifest = []
for key, fn in FILES.items():
    doc = pymupdf.open(os.path.join(BASE, fn))
    for i in range(doc.page_count):
        page = doc[i]
        pix = page.get_pixmap(dpi=110)
        path = os.path.join(OUT, f"{key}_{i+1:02d}.png")
        pix.save(path)
        manifest.append({"level": key, "page": i + 1, "path": path})

json.dump(manifest, open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8"), indent=1)
print(f"rendered {len(manifest)} pages to {OUT}")
