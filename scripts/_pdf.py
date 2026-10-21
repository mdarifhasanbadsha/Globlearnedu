"""Extract raw text from the four RK Edu PDFs so the content can be read."""
import io
import os
import sys

BASE = r"C:\Users\mdari\Documents\xwechat_files\wxid_ufskg89pvd1922_c969\msg\file\2026-10"
FILES = {
    "bachelor": "Bachelor March 2027 Intake- The RK Edu(1).pdf",
    "language": "Language offer March 2027 The RK Edu(1).pdf",
    "master": "Master's September 2027 intake- The RK EDU(1).pdf",
    "phd": "PhD university list- Sep 2027- The RK Edu(1).pdf",
}

try:
    from pypdf import PdfReader
except ImportError:
    print("pypdf not available")
    sys.exit(1)

for key, name in FILES.items():
    path = os.path.join(BASE, name)
    if not os.path.exists(path):
        print(f"MISSING: {name}")
        continue
    reader = PdfReader(path)
    pages = []
    for p in reader.pages:
        try:
            pages.append(p.extract_text() or "")
        except Exception as e:
            pages.append(f"[extract error: {e}]")
    text = "\n\n----- PAGE BREAK -----\n\n".join(pages)
    out = f"scripts/_pdf_{key}.txt"
    with io.open(out, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"{key}: {len(reader.pages)} pages, {len(text)} chars -> {out}")
    print("   first 200 chars:", repr(text[:200]))
