import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { CAPTIONS } from "../captions";
import { COLORS, FONT_SANS, ZONE } from "../theme";

const FADE = 7;

/**
 * Burned-in narration captions, one short line at a time in the bottom third.
 * Mounted at the root of the composition so `useCurrentFrame()` is absolute.
 */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: ZONE.captionBottom,
        paddingLeft: 80,
        paddingRight: 80,
      }}
    >
      {CAPTIONS.map((line) => {
        if (frame < line.from || frame > line.to) {
          return null;
        }

        if (
          line.hiddenBetween &&
          frame >= line.hiddenBetween[0] &&
          frame <= line.hiddenBetween[1]
        ) {
          return null;
        }

        return (
          <div
            key={line.from}
            style={{
              position: "absolute",
              bottom: ZONE.captionBottom,
              left: 80,
              right: 80,
              textAlign: "center",
              fontFamily: FONT_SANS,
              fontWeight: 800,
              fontSize: 64,
              lineHeight: 1.18,
              letterSpacing: -1,
              color: COLORS.ink,
              textShadow: "0 6px 34px rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,1)",
              // Fades stay inside the line's own window so two lines are
              // never on screen at once.
              opacity: interpolate(
                frame,
                [line.from, line.from + FADE, line.to - FADE, line.to],
                [0, 1, 1, 0],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              ),
              translate: interpolate(
                frame,
                [line.from, line.from + FADE],
                ["0px 18px", "0px 0px"],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              ),
            }}
          >
            {line.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
