// REMA brand bitmaps: the single source of truth for every mark, glyph and
// wordmark. Each string is one row of dots.
//   '#'  lit dot (ink: white on dark, near-black on light)
//   'R'  signal-red dot (the text cursor; red always means "mic live" in the
//        UI, the app icon is the one exception)
//   '.'  unlit dot (drawn faintly only at large sizes)

/** The mark: a spoken waveform settles into a line of text that ends in a
 *  red cursor. 11 x 7. */
export const MARK = [
  "....#......",
  "..#.##....R",
  ".######...R",
  "#########.R",
  ".######...R",
  "..#.##....R",
  "....#......",
];

/** The mark redrawn for 16 to 32 px: 5 x 5. */
export const MARK_SMALL = ["..#.R", ".###R", "####R", ".###R", "..#.R"];

/** Tray glyphs, 5 x 5, same grid as MARK_SMALL. */
export const TRAY = {
  /** Idle: the mark with a plain cursor. */
  idle: ["..#.#", ".####", "#####", ".####", "..#.#"],
  /** Recording: the mark with a red cursor. */
  recording: MARK_SMALL,
  /** Transcribing: an ellipsis and the cursor. */
  transcribing: ["....#", "....#", "#.#.#", "....#", "....#"],
};

/** Badge for the bundled cleanup model: lines of text and a sparkle. 9 x 7. */
export const CLEANUP_BADGE = [
  ".......#.",
  "#####.###",
  ".......#.",
  "######...",
  ".........",
  "####.....",
  ".........",
];

/** 5 x 7 capitals for the wordmark. */
export const LETTERS = {
  R: ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  M: ["#...#", "##.##", "#.#.#", "#.#.#", "#...#", "#...#", "#...#"],
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
};

export const WORD = "REMA";

export const COLORS = {
  tile: "#000000",
  ink: "#FFFFFF",
  inkOnLight: "#0A0A0A",
  signal: "#FF4D3A",
  unlit: "#FFFFFF",
  unlitOpacity: 0.1,
};
