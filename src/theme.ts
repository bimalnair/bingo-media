// Shared design tokens for the BingoIntro composition.
// Visual thesis: cold green silicon resolves into warm amber soul.

export const COLORS = {
  bg: "#0B0907",
  green: "#76B900", // NVIDIA green - silicon, board, services
  amber: "#F5A623", // Bingo's soul - eyes, pulses, links
  gold: "#FFCE7A",
  pla: "#A8794F", // 3D-printed shell brown - dog face strokes
  ink: "#F0E9DE", // headline text
  inkDim: "#7A7066", // secondary text
} as const;

export const FONT_SANS =
  '"Inter", "Poppins", "Montserrat", "Futura", "Helvetica Neue", "Liberation Sans", Arial, sans-serif';

export const FONT_MONO =
  '"JetBrains Mono", "IBM Plex Mono", "SF Mono", "DejaVu Sans Mono", "Liberation Mono", monospace';

// Vertical layout zones for 1080x1920 portrait.
export const ZONE = {
  labelTop: 250, // scene label band
  stageCenterY: 900, // centre of the main visual
  captionBottom: 210, // distance of the caption block from the bottom edge
} as const;

// Clamp a 0..1 master progress value into a sub-stage of the same range.
export const stage = (p: number, from: number, to: number) =>
  Math.max(0, Math.min(1, (p - from) / (to - from)));
