#!/usr/bin/env bash
# build_video.sh — bản tổng quát của build_video_ktv.sh: sinh thuyết minh (edge-tts)
# rồi ghép N segment webm thành 1 mp4 390x844 h264+aac.
# Thuyết minh đặt trong <workdir>/narration.txt — dòng i = lời cho seg<i>.webm.
# Chạy: bash build_video.sh <workdir> <outfile.mp4>
set -euo pipefail
WORK=${1:?usage: build_video.sh <workdir> <outfile>}
OUTFILE=${2:?usage: build_video.sh <workdir> <outfile>}
ROOT=/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc
EDGE=$ROOT/env/bin/edge-tts
VOICE=vi-VN-HoaiMyNeural

cd "$WORK"
[[ -f narration.txt ]] || { echo "thiếu $WORK/narration.txt"; exit 1; }
mkdir -p "$(dirname "$OUTFILE")"
: > concat.txt
i=0
while IFS= read -r TEXT; do
  [[ -z "$TEXT" ]] && continue
  i=$((i+1))
  [[ -f "seg$i.webm" ]] || { echo "thiếu seg$i.webm"; exit 1; }
  # edge-tts thỉnh thoảng bị NoAudioReceived (rate limit) khi gọi liên tiếp → retry
  ok=0
  for try in 1 2 3 4; do
    if "$EDGE" --voice "$VOICE" --text "$TEXT" --write-media "seg$i.mp3" >/dev/null </dev/null; then ok=1; break; fi
    echo "  seg$i: edge-tts lỗi (lần $try) — chờ 5s thử lại"; sleep 5
  done
  [[ $ok -eq 1 ]] || { echo "edge-tts fail hẳn ở seg$i"; exit 1; }
  sleep 2
  VDUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "seg$i.webm")
  ADUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "seg$i.mp3")
  # đoạn dài = max(video, audio + 0.5s nghỉ); video đóng băng frame cuối chờ hết lời
  T=$(python3 -c "print(round(max($VDUR, $ADUR + 0.5), 2))")
  # -nostdin BẮT BUỘC: ffmpeg trong while-read sẽ nuốt stdin = mất các dòng narration sau
  ffmpeg -nostdin -y -v error -i "seg$i.webm" -i "seg$i.mp3" \
    -filter_complex "[0:v]fps=25,tpad=stop_mode=clone:stop_duration=90,format=yuv420p[v];[1:a]aresample=44100,apad[a]" \
    -map "[v]" -map "[a]" -t "$T" \
    -c:v libx264 -preset medium -crf 22 -c:a aac -b:a 128k -ar 44100 "part$i.mp4"
  echo "file 'part$i.mp4'" >> concat.txt
  echo "seg$i: video=${VDUR}s audio=${ADUR}s -> ${T}s"
done < narration.txt
[[ $i -gt 0 ]] || { echo "narration.txt rỗng"; exit 1; }
ffmpeg -nostdin -y -v error -f concat -safe 0 -i concat.txt -c copy -movflags +faststart "$OUTFILE"
echo "OK -> $OUTFILE"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUTFILE"
