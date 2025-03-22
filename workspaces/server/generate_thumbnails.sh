#!/bin/bash
set -euxo pipefail

cd "$(dirname "$0")"

BASE_DIR="streams"
THUMBNAIL_DIR="streams-thumbnail"

rm -rf "$THUMBNAIL_DIR"
mkdir -p "$THUMBNAIL_DIR"

for dir in "$BASE_DIR"/*; do
    dir_name=$(basename "$dir")
    echo "Processing directory: $dir_name"
    
    ts_files=$(find "$dir" -name "*.ts" | sort)
    if [ -z "$ts_files" ]; then
        echo "No .ts files found in $dir_name, skipping..."
        continue
    fi
    
    concat_list=""
    for ts_file in $ts_files; do
        concat_list="${concat_list}${ts_file}|"
    done
    concat_list=${concat_list%|}  # 末尾のパイプ文字を削除
    
    # 1秒ごとのサムネイルを生成（160x90、タイル状）
    echo "Generating thumbnails..."
    ffmpeg -i "concat:$concat_list" -vf "fps=1,scale=160:90,tile=250x1" -frames:v 1 "$THUMBNAIL_DIR/$dir_name.jpg"
    
    echo "Thumbnails generated for $dir_name"
done

echo "All thumbnails generated successfully!"

ls -lh "$THUMBNAIL_DIR"
