# Tasks

## TODO

- `<AspectRatio>`, `useScrollSnap`をCSSで再実装
- View Transitionが設定されているようなので調査
- 各ページのFirst viewに入っている画像をlazy loadから除外
- episodeページで`<script>`タグが作られたり消えたりしているのを調査
- 動画ページのJS最適化(video.js, hls.js)
- `X-AREMA-INTERNAL`がなにか調べる
- バッチ (batshit) を消せないか調査

## Done

- IconのTree shaking
- FCPでスタイルが適用されていない原因を調査
- Babel -> SWC
- 不要なPolyfill削除
- CSS Minify
- webpack -> rspack
- Client Chunkをimmutableにする
  - main.{js,css}にcontent hashを付与
  - serverでwebpackのビルド結果を読み取って動的にjsファイルのパスを生成
  - clientではそれをどうにかして読み取る (scriptタグに #arema-main-script を付与するとか)
- 画像最適化
- 本当にSSRできているか確認
- Hydrationに失敗していないか確認
- DBにインデックス設定
