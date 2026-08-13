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
import { COLORS, FONT_MONO, FONT_SANS, ZONE } from "../theme";

/**
 * Scene 2 (abs 233-625): the Jetson AGX Orin board draws itself in and the
 * core starts to glow green.
 */
export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelIn = spring({ frame: frame - 250, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [0, 14, 372, 392], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: ZONE.labelTop,
          textAlign: "center",
          fontFamily: FONT_SANS,
          fontWeight: 800,
          fontSize: 76,
          letterSpacing: -2,
          color: COLORS.ink,
          opacity: interpolate(frame, [10, 46], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        The brain
      </div>

      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: ZONE.stageCenterY - 330,
          height: 660,
          scale: interpolate(frame, [0, 392], [0.98, 1.05], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            output: "perceptual-scale",
          }),
        }}
      >
        <Board
          progress={interpolate(frame, [15, 250], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.33, 0, 0.2, 1),
          })}
          coreGlow={interpolate(frame, [225, 330], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}
        />
      </div>

      {/* Technical label */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: ZONE.stageCenterY + 400,
          textAlign: "center",
          fontFamily: FONT_MONO,
          fontSize: 46,
          letterSpacing: 2,
          color: COLORS.green,
          opacity: labelIn,
          translate: interpolate(labelIn, [0, 1], ["0px 22px", "0px 0px"]),
        }}
      >
        NVIDIA Jetson AGX Orin 64GB
      </div>
    </AbsoluteFill>
  );
};
