"""Expose the underlying Postgres message, not just Drizzle's wrapper."""
import io

PATH = "src/app/api/public/chat/route.ts"

with io.open(PATH, "r", encoding="utf-8") as f:
    src = f.read()

old = '      { error: "Chat failed", detail: String(e?.message ?? e).slice(0, 300) },'

new = (
    "      {\n"
    '        error: "Chat failed",\n'
    "        // Drizzle wraps the driver error, and the wrapper text alone hides\n"
    "        // which column or table actually failed. The cause message is the\n"
    "        // one that names it, so both are surfaced (and truncated).\n"
    "        detail: String(e?.message ?? e).slice(0, 300),\n"
    "        cause: String((e as any)?.cause?.message ?? \"\").slice(0, 300),\n"
    "      },"
)

if old in src:
    src = src.replace(old, new, 1)
    with io.open(PATH, "w", encoding="utf-8", newline="\n") as f:
        f.write(src)
    print("cause exposed")
else:
    print("MARKER NOT FOUND")
