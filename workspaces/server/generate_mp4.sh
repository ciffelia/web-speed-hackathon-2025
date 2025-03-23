#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

BASE_DIR="streams"
MP4_DIR="streams-mp4"

rm -rf "$MP4_DIR"
mkdir -p "$MP4_DIR"

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
    concat_list=${concat_list%|}

    echo "Generating MP4..."
    ffmpeg -i "concat:$concat_list" -s 480x270 -c:v libx264 -preset fast -crf 23 -c:a copy -movflags +faststart \
        -f mp4 -y "$MP4_DIR/$dir_name.mp4"

    echo "MP4 generated for $dir_name"
done

echo "All files generated successfully!"

ls -lh "$MP4_DIR"
