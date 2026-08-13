import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { blinkAt, DogFace } from "../components/DogFace";
import { COLORS, FONT_MONO, FONT_SANS, ZONE } from "../theme";

const FACE_CY = 860;
const FACE_SIZE = 800;
const BLINKS = [92, 154, 208, 264, 316];

// The 18 service nodes from scene 3, collapsing inward into the face.
const COLLAPSE = Array.from({ length: 18 }, (_, i) => (-90 + i * 20) * (Math.PI / 180));

/**
 * Scene 5 (abs 1339-1679): everything resolves into one large Boxer face with
 * amber eyes, then the handle card.
 */
export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const faceIn = spring({ frame: frame - 12, fps, config: { damping: 200 } });
  const handleIn = spring({ frame: frame - 281, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [0, 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      {/* Green nodes converging into the face */}
      <AbsoluteFill>
        <svg viewBox="0 0 1080 1920" style={{ width: 1080, height: 1920 }}>
          {COLLAPSE.map((rad, i) => {
            const r = interpolate(frame, [0, 62], [400, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.5, 0, 0.75, 0),
            });
            return (
              <circle
                key={i}
                cx={540 + r * Math.cos(rad)}
                cy={FACE_CY + r * Math.sin(rad)}
                r={12}
                fill={COLORS.green}
                opacity={interpolate(frame, [0, 40, 66], [0.9, 0.6, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })}
              />
            );
          })}
        </svg>
      </AbsoluteFill>

      {/* One face */}
      <div
        style={{
          position: "absolute",
          left: 540 - FACE_SIZE / 2,
          top: FACE_CY - FACE_SIZE / 2,
          width: FACE_SIZE,
          height: FACE_SIZE,
          opacity: faceIn,
          scale: interpolate(faceIn, [0, 1], [0.62, 1], {
            output: "perceptual-scale",
          }),
        }}
      >
        <DogFace eyeOpen={blinkAt(frame, BLINKS)} glow={faceIn} />
      </div>

      {/* Headline */}
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
          opacity: interpolate(frame, [70, 106], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        One soul. <span style={{ color: COLORS.amber }}>Many bodies.</span>
      </div>

      {/* Outro handle card (abs 1620-1679) */}
      <div
        style={{
          position: "absolute",
          left: 190,
          width: 700,
          top: 1400,
          padding: "34px 0",
          textAlign: "center",
          border: `4px solid ${COLORS.amber}`,
          borderRadius: 28,
          backgroundColor: "rgba(11,9,7,0.72)",
          fontFamily: FONT_MONO,
          fontSize: 72,
          letterSpacing: 2,
          color: COLORS.gold,
          opacity: handleIn,
          scale: interpolate(handleIn, [0, 1], [0.82, 1], {
            output: "perceptual-scale",
          }),
        }}
      >
        @igbingo
      </div>
    </AbsoluteFill>
  );
};
