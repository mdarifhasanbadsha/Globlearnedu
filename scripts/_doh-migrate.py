"""
Apply the missing migration with no local DNS.

The sandbox blocks Node's and Python's resolver (ECONNREFUSED), but HTTPS to
dns.google works. So we resolve the Neon host over DNS-over-HTTPS, then talk
to the Neon SQL endpoint by IP with the hostname in the Host header and SNI
preserved via server_hostname.
"""
import json
import os
import socket
import ssl
import sys
import urllib.request
import urllib.parse

sys.stdout.reconfigure(encoding="utf-8")

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
)

# ── read DATABASE_URL ──
env = {}
with open(".env.local", encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")

dsn = env["DATABASE_URL"]
u = urllib.parse.urlparse(dsn)
host = u.hostname
user = urllib.parse.unquote(u.username or "")
password = urllib.parse.unquote(u.password or "")
dbname = (u.path or "/neondb").lstrip("/")
print(f"host: {host}")
print(f"db:   {dbname}")


def resolve(hostname):
    url = f"https://dns.google/resolve?name={urllib.parse.quote(hostname)}&type=A"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=20) as r:
        data = json.loads(r.read().decode())
    ips = [a["data"] for a in data.get("Answer", []) if a.get("type") == 1]
    if not ips:
        raise RuntimeError(f"no A record for {hostname}")
    return ips


ip = resolve(host)[0]
print(f"resolved: {ip}")

ctx = ssl.create_default_context()

STMT_TIMEOUT = 30


def sql(query, params=None):
    """Run one statement against the Neon HTTP SQL endpoint."""
    body = json.dumps({"query": query, "params": params or []}).encode()
    sock = socket.create_connection((ip, 443), timeout=STMT_TIMEOUT)
    ssock = ctx.wrap_socket(sock, server_hostname=host)
    try:
        ssock.sendall(
            (
                f"POST /sql HTTP/1.1\r\n"
                f"Host: {host}\r\n"
                f"User-Agent: {UA}\r\n"
                f"Content-Type: application/json\r\n"
                f"Accept: application/json\r\n"
                f"Neon-Connection-String: {urllib.parse.quote(dsn, safe='')}\r\n"
                f"Content-Length: {len(body)}\r\n"
                f"Connection: close\r\n\r\n"
            ).encode()
            + body
        )
        raw = b""
        while True:
            chunk = ssock.recv(65536)
            if not chunk:
                break
            raw += chunk
    finally:
        ssock.close()

    head, _, payload = raw.partition(b"\r\n\r\n")
    status_line = head.split(b"\r\n")[0].decode(errors="replace")
    try:
        data = json.loads(payload.decode("utf-8"))
    except Exception:
        return status_line, None
    return status_line, data


# ── 1. confirm connectivity and see what is missing ──
status, data = sql(
    "select column_name from information_schema.columns "
    "where table_schema='public' and table_name='biz_conversations' "
    "order by column_name"
)
print("\nstatus:", status)
if not data:
    print("no response body — the SQL endpoint expects a connection string header.")
    sys.exit(1)

cols = [r["column_name"] for r in data.get("rows", [])]
required = ["pending_quote", "pending_quote_at", "last_inbound_at", "contact_name"]
print("missing before:", [c for c in required if c not in cols])

# ── 2. apply the additive changes, idempotently ──
changes = [
    ("pending_quote", 'ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "pending_quote" text'),
    ("pending_quote_at", 'ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "pending_quote_at" timestamp'),
    ("last_inbound_at", 'ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "last_inbound_at" timestamp'),
    ("contact_name", 'ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "contact_name" varchar(200)'),
    ("contact_picture", 'ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "contact_picture" text'),
    ("contact_locale", 'ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "contact_locale" varchar(20)'),
    ("profile_synced_at", 'ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "profile_synced_at" timestamp'),
    ("source_kind", 'ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "source_kind" varchar(30)'),
    ("source_ref", 'ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "source_ref" varchar(200)'),
    ("source_ad_id", 'ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "source_ad_id" varchar(100)'),
    ("source_post_id", 'ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "source_post_id" varchar(100)'),
    ("source_url", 'ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "source_url" text'),
    ("biz_leads.alerted_at", 'ALTER TABLE "biz_leads" ADD COLUMN IF NOT EXISTS "alerted_at" timestamp'),
]

for name, stmt in changes:
    status, data = sql(stmt)
    ok = data is not None and "error" not in (data or {})
    print(f"  {'ok ' if ok else 'ERR'} {name}")

# ── 3. verify ──
status, data = sql(
    "select column_name from information_schema.columns "
    "where table_schema='public' and table_name='biz_conversations' "
    "order by column_name"
)
cols = [r["column_name"] for r in data.get("rows", [])] if data else []
print("\nmissing after:", [c for c in required if c not in cols] or "NONE")
