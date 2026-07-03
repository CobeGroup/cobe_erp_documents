#!/usr/bin/env bash
# build_video_ktv.sh — sinh thuyết minh (edge-tts, giọng như video checkin-flow) rồi
# ghép 5 segment webm (từ video_ktv.js) thành 1 mp4 390x844 h264+aac.
# Chạy: bash build_video_ktv.sh <workdir chứa seg1..seg5.webm> [outfile.mp4]
set -euo pipefail
WORK=${1:?usage: build_video_ktv.sh <workdir> [outfile]}
ROOT=/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc
OUTFILE=${2:-$ROOT/help/cobe_erp_documents/users/images/guide/ktv/cham-cong-ktv.mp4}
EDGE=$ROOT/env/bin/edge-tts
VOICE=vi-VN-HoaiMyNeural

NARR1="Xin chào! Đây là hướng dẫn chấm công cho kỹ thuật viên hiện trường. Ngày làm việc bình thường, buổi sáng bạn ghé văn phòng, bấm Chấm công Vào và xác nhận vị trí — vậy là xong."
NARR2="Buổi chiều, làm xong ở nhà khách, bạn check-out ngay tại chỗ. Hệ thống không kiểm tra vị trí ở chiều ra cho kỹ thuật viên, nên không cần quay về văn phòng. Công ngày này tính theo giờ thật."
NARR3="Lưu ý: chiều vào vẫn phải đúng văn phòng. Nếu đứng ở hiện trường mà bấm chấm công vào, ứng dụng sẽ báo ngoài vùng văn phòng và không ghi nhận."
NARR4="Ngày đi thẳng hiện trường không ghé văn phòng, hãy tạo đề xuất trước. Vào Bảng công, bấm nút Đề xuất, ghi rõ lý do rồi gửi. Có đơn rồi, dù chưa được duyệt, bạn đã chấm công ngoài văn phòng được ngay."
NARR5="Khi quản lý duyệt, ngày đó tự tính công Có mặt theo ca chuẩn. Còn nếu đơn bị từ chối, ngày đó sẽ bị vắng — nên nhắn quản lý duyệt sớm nhé. Chúc bạn thao tác thuận lợi!"

cd "$WORK"
mkdir -p "$(dirname "$OUTFILE")"
: > concat.txt
for i in 1 2 3 4 5; do
  eval "TEXT=\$NARR$i"
  "$EDGE" --voice "$VOICE" --text "$TEXT" --write-media "seg$i.mp3" >/dev/null
  VDUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "seg$i.webm")
  ADUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "seg$i.mp3")
  # đoạn dài = max(video, audio + 0.5s nghỉ); video đóng băng frame cuối chờ hết lời
  T=$(python3 -c "print(round(max($VDUR, $ADUR + 0.5), 2))")
  ffmpeg -y -v error -i "seg$i.webm" -i "seg$i.mp3" \
    -filter_complex "[0:v]fps=25,tpad=stop_mode=clone:stop_duration=60,format=yuv420p[v];[1:a]aresample=44100,apad[a]" \
    -map "[v]" -map "[a]" -t "$T" \
    -c:v libx264 -preset medium -crf 22 -c:a aac -b:a 128k -ar 44100 "part$i.mp4"
  echo "file 'part$i.mp4'" >> concat.txt
  echo "seg$i: video=${VDUR}s audio=${ADUR}s -> ${T}s"
done
ffmpeg -y -v error -f concat -safe 0 -i concat.txt -c copy -movflags +faststart "$OUTFILE"
echo "OK -> $OUTFILE"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUTFILE"
