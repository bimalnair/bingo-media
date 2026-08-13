import React from "react";
import { COLORS } from "../theme";

/**
 * Round Boxer face rendered in PLA-brown strokes with amber eyes.
 * `eyeOpen` 0..1 squashes the eyes for blinks; `glow` 0..1 fades the amber halo.
 */
export const DogFace: React.FC<{
  eyeOpen: number;
  glow: number;
  strokeWidth?: number;
}> = ({ eyeOpen, glow, strokeWidth = 9 }) => {
  return (
    <svg
      viewBox="0 0 400 400"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
    >
      <defs>
        <radialGradient id="faceGlow">
          <stop offset="0%" stopColor={COLORS.amber} stopOpacity={0.4} />
          <stop offset="60%" stopColor={COLORS.amber} stopOpacity={0.1} />
          <stop offset="100%" stopColor={COLORS.amber} stopOpacity={0} />
        </radialGradient>
      </defs>

      <circle cx={200} cy={206} r={200} fill="url(#faceGlow)" opacity={glow} />

      {/* Floppy ears */}
      <ellipse
        cx={62}
        cy={212}
        rx={40}
        ry={68}
        fill={COLORS.bg}
        stroke={COLORS.pla}
        strokeWidth={strokeWidth}
        transform="rotate(-18 62 212)"
      />
      <ellipse
        cx={338}
        cy={212}
        rx={40}
        ry={68}
        fill={COLORS.bg}
        stroke={COLORS.pla}
        strokeWidth={strokeWidth}
        transform="rotate(18 338 212)"
      />

      {/* Head */}
      <circle
        cx={200}
        cy={206}
        r={150}
        fill={COLORS.bg}
        stroke={COLORS.pla}
        strokeWidth={strokeWidth}
      />

      {/* Muzzle */}
      <ellipse
        cx={200}
        cy={278}
        rx={80}
        ry={58}
        fill="none"
        stroke={COLORS.pla}
        strokeWidth={strokeWidth * 0.8}
        opacity={0.85}
      />

      {/* Eyes */}
      <ellipse
        cx={144}
        cy={182}
        rx={24}
        ry={Math.max(2.5, 24 * eyeOpen)}
        fill={COLORS.amber}
      />
      <ellipse
        cx={256}
        cy={182}
        rx={24}
        ry={Math.max(2.5, 24 * eyeOpen)}
        fill={COLORS.amber}
      />

      {/* Nose */}
      <ellipse cx={200} cy={252} rx={27} ry={19} fill={COLORS.pla} />

      {/* Mouth */}
      <path
        d="M 200 271 V 290 M 200 290 Q 172 314 148 292 M 200 290 Q 228 314 252 292"
        fill="none"
        stroke={COLORS.pla}
        strokeWidth={strokeWidth * 0.75}
        strokeLinecap="round"
      />
    </svg>
  );
};

/**
 * Deterministic blink: fully open except for short dips at fixed frames.
 * Returns 0..1 eyelid openness for the given frame.
 */
export const blinkAt = (frame: number, starts: number[]) => {
  let open = 1;
  for (const s of starts) {
    const t = frame - s;
    if (t >= 0 && t <= 8) {
      // 4 frames closing, 4 frames opening
      open = Math.min(open, t <= 4 ? 1 - t / 4 : (t - 4) / 4);
    }
  }
  return open;
};
