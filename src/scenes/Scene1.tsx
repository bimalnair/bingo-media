import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_MONO, FONT_SANS, ZONE } from "../theme";

const RIPPLES = [0, 1, 2];
const RIPPLE_PERIOD = 96;

/**
 * Scene 1 (abs 0-232): dark frame, a warm amber pulse breathing in the centre,
 * then the title "Inside Bingo".
 */
export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame: frame - 42, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [0, 12, 208, 232], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      {/* Expanding ripples off the pulse */}
      {RIPPLES.map((k) => {
        const t = ((frame + k * (RIPPLE_PERIOD / RIPPLES.length)) %
          RIPPLE_PERIOD) /
          RIPPLE_PERIOD;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: 540 - 180,
              top: ZONE.stageCenterY - 180,
              width: 360,
              height: 360,
              borderRadius: "50%",
              border: `3px solid ${COLORS.amber}`,
              opacity: (1 - t) * 0.34,
              scale: interpolate(t, [0, 1], [0.35, 2.5], {
                output: "perceptual-scale",
              }),
            }}
          />
        );
      })}

      {/* Warm core, breathing */}
      <div
        style={{
          position: "absolute",
          left: 540 - 230,
          top: ZONE.stageCenterY - 230,
          width: 460,
          height: 460,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.gold} 0%, ${COLORS.amber} 26%, rgba(245,166,35,0.25) 52%, rgba(245,166,35,0) 74%)`,
          scale: interpolate(Math.sin(frame / 16), [-1, 1], [0.88, 1.06], {
            output: "perceptual-scale",
          }),
          opacity: interpolate(Math.sin(frame / 16), [-1, 1], [0.62, 0.95]),
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: ZONE.stageCenterY + 340,
          textAlign: "center",
          fontFamily: FONT_SANS,
          fontWeight: 800,
          fontSize: 108,
          letterSpacing: -3,
          color: COLORS.ink,
          opacity: titleIn,
          translate: interpolate(titleIn, [0, 1], ["0px 34px", "0px 0px"]),
        }}
      >
        Inside Bingo
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: ZONE.stageCenterY + 480,
          textAlign: "center",
          fontFamily: FONT_MONO,
          fontSize: 38,
          letterSpacing: 8,
          color: COLORS.inkDim,
          opacity: spring({
            frame: frame - 64,
            fps,
            config: { damping: 200 },
          }),
        }}
      >
        A HOME ROBOT
      </div>
    </AbsoluteFill>
  );
};
