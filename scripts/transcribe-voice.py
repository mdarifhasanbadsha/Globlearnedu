import sys, io, json, os, subprocess, wave
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

import numpy as np
from faster_whisper import WhisperModel

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICE_DIR = os.path.join(BASE, "scratch_voice")
FFMPEG = r"C:\Users\mdari\Documents\deepseek-harness\default-workspace\ffmpeg\bin\ffmpeg.exe"

MODEL_SIZE = os.environ.get("WHISPER_MODEL", "small")
print(f"loading model: {MODEL_SIZE}")
model = WhisperModel(MODEL_SIZE, device="cpu", compute_type="int8")

manifest_path = os.path.join(VOICE_DIR, "manifest.json")
with open(manifest_path, encoding="utf-8") as f:
    manifest = json.load(f)

results = []

for entry in manifest:
    src = os.path.join(VOICE_DIR, os.path.basename(entry["file"]))
    wav = src.rsplit(".", 1)[0] + ".wav"

    # ffmpeg handles the container; we decode the WAV ourselves so PyAV
    # is never involved (it has a known metadata_errors incompatibility).
    if not os.path.exists(wav):
        p = subprocess.run(
            [FFMPEG, "-y", "-loglevel", "error", "-i", src, "-ar", "16000", "-ac", "1", wav],
            capture_output=True,
        )
        if p.returncode != 0:
            print(f"  ffmpeg failed for {os.path.basename(src)}")
            continue

    with wave.open(wav, "rb") as w:
        raw = w.readframes(w.getnframes())
    audio = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0

    if len(audio) < 16000:
        print(f"  too short: {os.path.basename(src)}")
        continue

    segments, info = model.transcribe(
        audio, beam_size=5, language=None, vad_filter=True,
        condition_on_previous_text=False,
    )
    text = " ".join(s.text.strip() for s in segments).strip()

    print(f"\n{os.path.basename(src)}  lang={info.language} ({info.language_probability:.2f}) dur={info.duration:.1f}s")
    print(f"  -> {text[:200]}")

    results.append({
        "externalId": entry["externalId"],
        "text": text,
        "language": info.language,
        "confidence": round(info.language_probability, 3),
    })

out = os.path.join(VOICE_DIR, "transcripts.json")
with open(out, "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=1)

print(f"\ntranscribed {len(results)}/{len(manifest)} -> {out}")
