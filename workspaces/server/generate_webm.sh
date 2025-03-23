#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

BASE_DIR="streams"
WEBM_DIR="streams-webm"

rm -rf "$WEBM_DIR"
mkdir -p "$WEBM_DIR"

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

    echo "Generating WebM..."
    ffmpeg -i "concat:$concat_list" -s 480x270 -c:v libvpx-vp9 -b:v 300K -threads 12 -speed 1 \
        -tile-columns 6 -frame-parallel 1 -auto-alt-ref 1 -lag-in-frames 25 \
        -c:a libopus -b:a 64k -f webm "$WEBM_DIR/$dir_name.webm"

    echo "WebM generated for $dir_name"
done

echo "All files generated successfully!"

ls -lh "$WEBM_DIR"
