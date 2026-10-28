import React from "react";
import { WORDMARK_PATH, WORDMARK_WIDTH } from "./pages/insights/wordmark";

interface WordmarkProps {
  className?: string;
}

/**
 * The REMA wordmark: the name in the brand's 5 x 7 dot capitals
 * (`brand/bitmaps.mjs`), filled with `currentColor` so it follows the text
 * colour on light and dark grounds.
 */
export const Wordmark: React.FC<WordmarkProps> = ({ className = "" }) => (
  <svg
    viewBox={`0 -60 ${Math.ceil(WORDMARK_WIDTH)} 61.5`}
    className={`h-[1em] w-auto text-ink select-none inline-block ${className}`}
    role="img"
    aria-label="REMA"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={WORDMARK_PATH} fill="currentColor" />
  </svg>
);

export default Wordmark;
