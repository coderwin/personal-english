#!/usr/bin/env python3
"""Generate public/audio/*.mp3 from content/seed-passages.json using Google TTS."""

from __future__ import annotations

import json
import sys
from pathlib import Path

try:
    from gtts import gTTS
except ImportError:
    print("Install gTTS: pip install gTTS", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
JSON_PATH = ROOT / "content" / "seed-passages.json"
AUDIO_DIR = ROOT / "public" / "audio"


def main() -> None:
    passages = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)

    for entry in passages:
        audio_file = entry["audioFile"]
        transcript = entry["transcript"]
        out_path = AUDIO_DIR / audio_file
        print(f"Writing {out_path.name} …")
        tts = gTTS(text=transcript, lang="en")
        tts.save(str(out_path))

    print(f"Done — {len(passages)} file(s) in {AUDIO_DIR}")


if __name__ == "__main__":
    main()
