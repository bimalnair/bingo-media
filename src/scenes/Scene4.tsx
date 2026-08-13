import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Board } from "../components/Board";
import { blinkAt, DogFace } from "../components/DogFace";
import { COLORS, FONT_MONO, FONT_SANS, ZONE } from "../theme";

const BOARD_CY = 700;
const SAT_CY = 1250;
const SAT_SIZE = 250;

const SATELLITES = [
  { x: 218, delay: 26, label: "KITCHEN", blinks: [70, 150, 236] },
  { x: 540, delay: 56, label: "LIVING ROOM", blinks: [96, 178, 262] },
  { x: 862, delay: 86, label: "BEDROOM", blinks: [122, 204, 288] },
];

/**
 * Scene 4 (abs 996-1338): three satellite screens appear below the board,
 * joined to it by dashed links with data flowing inward.
 */
export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [0, 14, 324, 342], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      {/* Headline */}
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: ZONE.labelTop,
          textAlign: "center",
          fontFamily: FONT_SANS,
          fontWeight: 800,
          fontSize: 64,
          lineHeight: 1.16,
          letterSpacing: -2,
          color: COLORS.ink,
          opacity: interpolate(frame, [10, 46], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        Screens in every room.
        <br />
        <span style={{ color: COLORS.inkDim }}>No brains in any of them.</span>
      </div>

      {/* The one board */}
      <div
        style={{
          position: "absolute",
          left: 540 - 280,
          top: BOARD_CY - 192,
          width: 560,
          height: 385,
        }}
      >
        <Board progress={1} coreGlow={0.9} />
      </div>

      {/* Links: dashes travel from each satellite up into the board */}
      <AbsoluteFill>
        <svg viewBox="0 0 1080 1920" style={{ width: 1080, height: 1920 }}>
          {SATELLITES.map((s) => (
            <path
              key={s.x}
              d={`M ${s.x} ${SAT_CY - 96} C ${s.x} ${SAT_CY - 250}, 540 ${SAT_CY - 240}, 540 ${BOARD_CY + 195}`}
              fill="none"
              stroke={COLORS.amber}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray="16 26"
              strokeDashoffset={-frame * 2.6}
              opacity={interpolate(
                frame,
                [s.delay + 18, s.delay + 50],
                [0, 0.85],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              )}
            />
          ))}
        </svg>
      </AbsoluteFill>

      {/* Satellite dog faces */}
      {SATELLITES.map((s) => {
        const pop = spring({
          frame: frame - s.delay,
          fps,
          config: { damping: 14, mass: 0.7 },
        });

        return (
          <div key={s.x} style={{ opacity: pop }}>
            <div
              style={{
                position: "absolute",
                left: s.x - SAT_SIZE / 2,
                top: SAT_CY - SAT_SIZE / 2,
                width: SAT_SIZE,
                height: SAT_SIZE,
                scale: interpolate(pop, [0, 1], [0.4, 1], {
                  output: "perceptual-scale",
                }),
              }}
            >
              <DogFace
                eyeOpen={blinkAt(frame, s.blinks)}
                glow={0.5}
                strokeWidth={13}
              />
            </div>
            <div
              style={{
                position: "absolute",
                left: s.x - 180,
                width: 360,
                top: SAT_CY + SAT_SIZE / 2 + 24,
                textAlign: "center",
                fontFamily: FONT_MONO,
                fontSize: 32,
                letterSpacing: 3,
                color: COLORS.inkDim,
              }}
            >
              {s.label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
