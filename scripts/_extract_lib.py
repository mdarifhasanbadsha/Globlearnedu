"""Extract university and programme data from the four RK Edu PDFs.

The owner's requirements:
  - keep EVERYTHING, because the more reference we hold the more we can offer
  - keep city-only entries (no university name) so a student asking about a
    city can still be shown examples
  - strip all third-party company information (name, email, website, WeChat,
    apply-now links, phone numbers, marketing lines)
  - tag every entry with its level
"""

import io
import json
import os
import re

PDF_DIR = "scripts"

LEVELS = {
    "bachelor": "bachelor",
    "language": "language",
    "master": "master",
    "phd": "phd",
}

# ── scrubbing ──────────────────────────────────────────────────────────
# Anything that identifies the agency that produced the brochure must never
# reach a student, and must never reach our database.
SCRUB_PATTERNS = [
    r"THE\s*RK\s*EDUCATION(?:\s*CO\.?\s*LTD\.?)?",
    r"The\s*RK\s*EDU(?:CATION)?",
    r"RK\s*Edu(?:cation)?",
    r"therkedu\.com[^\s\)]*",
    r"applynow\.therkedu\.com[^\s\)]*",
    r"www\.\s*therkedu\.com[^\s\)]*",
    r"admission@therkedu\.com",
    r"Chongqing[-\s]*400000",
    r"WeChat\s*:?\s*\d+",
    r"18581187719",
    r"\[?Apply\s*Now\]?[^\n]*",
    r"Visit\s+more\s+Language\s+university[^\n]*",
    r"https?://\S*",
    r"www\.\S+",
    r"Very\s+low\s+service\s+charge",
    r"Only\s+Serious\s+Students\s+Contact[^\n]*",
    r"grab\s+your\s+seat[^\n]*",
    r"100%\s*Confirm\s+(?:admission|seat)[^\n]*",
    r"One\s+of\s+the\s+(?:beautiful|Mega)\s+city\s+in\s+china",
]

SCRUB_RE = re.compile("|".join(f"(?:{p})" for p in SCRUB_PATTERNS), re.I)


def scrub(text: str) -> str:
    if not text:
        return ""
    out = SCRUB_RE.sub(" ", text)
    out = re.sub(r"[ \t]+", " ", out)
    out = re.sub(r"\n{2,}", "\n", out)
    return out.strip(" \n\t-–—:;&,")


def clean_lines(text: str):
    lines = []
    for raw in text.split("\n"):
        s = raw.strip()
        if not s:
            continue
        s = scrub(s)
        if not s:
            continue
        if len(s) < 3:
            continue
        lines.append(s)
    return lines


# ── field extraction ───────────────────────────────────────────────────
UNIVERSITY_RE = re.compile(
    r"^((?:[A-Z][A-Za-z’'\(\)\.,&\- ]+\s+)?"
    r"(?:University|College|Institute|Academy|Polytechnic)"
    r"(?:\s+of\s+[A-Za-z’'&\- ]+)?"
    r"(?:\s*[-,]\s*[A-Za-z’'\- ]+)?)\s*$"
)

CITY_LINE_RE = re.compile(
    r"^([A-Za-z’'\- ]{2,30})\s*[Cc]ity\s*[,\s]\s*([A-Za-z’'\- ]{2,30})?\s*(?:[Pp]rovince)?\s*$"
)

LOCATION_RE = re.compile(r"Location\s*:?\s*([A-Za-z’'\- ,]{2,60})", re.I)


def find_university(lines):
    """The first line that names a university, cleaned of extra words."""
    for ln in lines[:6]:
        m = UNIVERSITY_RE.match(ln)
        if m:
            name = m.group(1).strip(" ,-")
            # A trailing city after a comma is not part of the name.
            name = re.sub(r"\s*[-,]\s*[A-Z][a-z]+$", "", name).strip()
            return name
    return None


def find_city(lines):
    for ln in lines[:8]:
        m = CITY_LINE_RE.match(ln)
        if m:
            city = m.group(1).strip()
            province = (m.group(2) or "").strip()
            return city, province or None
        m = LOCATION_RE.search(ln)
        if m:
            loc = re.split(r"[,\(]", m.group(1))[0].strip()
            if 2 < len(loc) < 40:
                return loc, None
    return None, None


def find_majors(lines):
    """Numbered majors, e.g. '1. Mechanism Design' or '78. Oncology'."""
    out = []
    for ln in lines:
        m = re.match(r"^\d{1,3}\s*[\.\)]\s*([A-Za-z’'\(\)\-\&, /]{3,70})$", ln)
        if m:
            out.append(m.group(1).strip(" ,/"))
    return out


def find_tuition(lines):
    vals = []
    for ln in lines:
        if re.search(r"tuition", ln, re.I):
            for m in re.finditer(r"([\d,]+(?:\.\d+)?)\s*(?:CNY|RMB|¥)", ln, re.I):
                vals.append(f"{m.group(1)} CNY")
        if re.search(r"tuition\s*(?:fee)?\s*:?\s*free", ln, re.I):
            vals.append("Tuition free")
    return "; ".join(dict.fromkeys(vals)) if vals else None


def find_hostel(lines):
    vals = []
    for ln in lines:
        if re.search(r"(?:dorm|accommodation|hostel)", ln, re.I):
            if re.search(r"free", ln, re.I):
                vals.append("Accommodation free")
            for m in re.finditer(r"([\d,]+(?:\.\d+)?)\s*(?:CNY|RMB|¥)", ln, re.I):
                vals.append(f"{m.group(1)} CNY")
    return "; ".join(dict.fromkeys(vals)) if vals else None


def find_intake(text):
    m = re.search(r"(March|September|September|Sep)\s*(?:intake\s*)?(20\d{2})", text, re.I)
    if m:
        month = "March" if m.group(1).lower().startswith("mar") else "September"
        return f"{month} {m.group(2)}"
    return None


def find_duration(lines):
    for ln in lines:
        m = re.search(r"(\d)\s*(?:Years?|Yr)", ln, re.I)
        if m:
            return int(m.group(1))
        m = re.search(r"(\d)\s*Year", ln, re.I)
        if m:
            return int(m.group(1))
    return None


def find_language(lines):
    for ln in lines:
        if re.search(r"taught\s+in\s+english", ln, re.I):
            return "English"
        if re.search(r"taught\s+in\s+chinese", ln, re.I):
            return "Chinese"
    return None


def find_scholarship(lines):
    parts = []
    for ln in lines:
        if re.search(r"scholarship|tuition\s*fee[s]?\s*:?\s*free|waiver", ln, re.I):
            parts.append(ln[:180])
    text = " ".join(parts)
    text = re.sub(r"\s+", " ", text).strip()
    return text[:400] if text else None


def find_documents(lines):
    docs = []
    capture = False
    for ln in lines:
        if re.match(r"^documents?\s*:?", ln, re.I):
            capture = True
            continue
        if capture:
            if re.match(r"^(?:note|deadline|scholarship|tuition)", ln, re.I):
                break
            if len(docs) < 20:
                docs.append(ln[:160])
    return docs
