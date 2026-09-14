#!/usr/bin/env bash
# Generates the short background loop + poster from an original MP4.
# Usage: bash scripts/prepare-media.sh path/to/original.mp4 [start-seconds]
set -euo pipefail
IN="${1:?usage: prepare-media.sh input.mp4 [start]}"
START="${2:-0}"
OUT="public/video"
FF="${FFMPEG:-ffmpeg}"
if ! command -v "$FF" >/dev/null 2>&1; then
  FF="$(python3 -c 'import imageio_ffmpeg as f; print(f.get_ffmpeg_exe())' 2>/dev/null || true)"
fi
[ -n "$FF" ] || { echo "ffmpeg not found. Install it or: pip install imageio-ffmpeg"; exit 1; }
mkdir -p "$OUT"
"$FF" -y -ss "$START" -i "$IN" -t 6 -an -vf "scale=1280:-2,fps=24" -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart "$OUT/loop.mp4"
"$FF" -y -ss "$START" -i "$IN" -t 6 -an -vf "scale=1280:-2,fps=24" -c:v libvpx-vp9 -crf 40 -b:v 0 -row-mt 1 "$OUT/loop.webm"
"$FF" -y -ss "$(python3 -c "print($START+1)")" -i "$IN" -vframes 1 -vf "scale=1280:-2" -q:v 3 "$OUT/poster.jpg"
ls -la "$OUT"
