import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

/** Dark frame with a soft warm radial vignette that breathes very slowly. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 46%, rgba(245,166,35,0.10) 0%, rgba(245,166,35,0.04) 34%, rgba(11,9,7,0) 68%)`,
          opacity: interpolate(
            Math.sin(frame / 42),
            [-1, 1],
            [0.75, 1],
          ),
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, rgba(11,9,7,0) 42%, rgba(0,0,0,0.55) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
