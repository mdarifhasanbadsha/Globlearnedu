import sys, io, os, subprocess, wave, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

import numpy as np

FFMPEG = r"C:\Users\mdari\Documents\deepseek-harness\default-workspace\ffmpeg\bin\ffmpeg.exe"
VOICE = os.path.join(os.getcwd(), "scratch_voice")

def load(name):
    src = os.path.join(VOICE, name)
    wav = src.rsplit(".", 1)[0] + ".wav"
    if not os.path.exists(wav):
        subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-i", src,
                        "-ar", "16000", "-ac", "1", wav], check=True)
    with wave.open(wav, "rb") as w:
        raw = w.readframes(w.getnframes())
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0

# Try the purpose-built Bangla ASR package (free, offline, MIT models).
try:
    from banglaspeech2text import Speech2Text
except Exception as e:
    print("import failed:", e)
    sys.exit(1)

print("loading Bangla ASR model (first run downloads)...")
stt = Speech2Text(model_size="base")
print("model ready")

for name in ["voice_001.m4a", "voice_002.m4a", "voice_003.m4a"]:
    audio = load(name)
    try:
        # The package may accept a path or (sample_rate, array)
        out = stt(audio, sample_rate=16000)
    except TypeError:
        out = stt(os.path.join(VOICE, name.rsplit(".", 1)[0] + ".wav"))
    text = out if isinstance(out, str) else str(out)
    print(f"\n{name}: {text[:250]}")
