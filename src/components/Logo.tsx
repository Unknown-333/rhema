import React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

/**
 * The REMA mark: a dot-matrix waveform that settles into a line of text and
 * ends in a red cursor, white on the black tile. Same bitmap as
 * `brand/bitmaps.mjs` (`MARK`), on the 1024 grid of `brand/svg/mark.svg`.
 */
const MARK = [
  "....#......",
  "..#.##....R",
  ".######...R",
  "#########.R",
  ".######...R",
  "..#.##....R",
  "....#......",
];

const PITCH = 68;
const RADIUS = 26;
const X0 = (1024 - MARK[0].length * PITCH) / 2;
const Y0 = (1024 - MARK.length * PITCH) / 2;

const DOTS = MARK.flatMap((row, y) =>
  [...row].flatMap((cell, x) =>
    cell === "." ? [] : [{ x, y, red: cell === "R" }],
  ),
);

export const Logo: React.FC<LogoProps> = ({ className = "", title }) => (
  <svg
    viewBox="0 0 1024 1024"
    className={className}
    role="img"
    aria-hidden={title ? undefined : true}
    aria-label={title}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="32" y="32" width="960" height="960" rx="211" fill="#000000" />
    {DOTS.map(({ x, y, red }) => (
      <circle
        key={`${x}-${y}`}
        cx={X0 + PITCH / 2 + x * PITCH}
        cy={Y0 + PITCH / 2 + y * PITCH}
        r={RADIUS}
        fill={red ? "#FF4D3A" : "#FFFFFF"}
      />
    ))}
  </svg>
);

export default Logo;
