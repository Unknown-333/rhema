# REMA brand assets

Everything here is generated from the dot bitmaps in `bitmaps.mjs`.

```sh
cd brand
bun install
bun build.mjs
```

`build.mjs` writes:

- `svg/`: the mark, a transparent glyph, the tray glyph, the lockups and the
  round puck boot screen.
- `png/`: the 1024 px master, a 256 px icon and the README lockups.
- The app's window and tray PNGs in `src-tauri/resources/`, the Windows
  `src-tauri/icons/icon.ico` with hand-tuned 16 to 32 px sizes, the favicon,
  the Android and iOS launcher icons, the cleanup-model badge and
  `src/components/pages/insights/wordmark.ts`.

For the remaining desktop icon sizes and the macOS `.icns`, run
`bun tauri icon brand/png/icon-1024.png` at the repo root first, then
`bun build.mjs` again so the small hand-tuned sizes win.

Design rules: black tile, white dots, and red only for the text cursor in the
mark and for "microphone is live" in the UI. Unlit dots appear only at 128 px
and above.
