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

const NODE_COUNT = 18;
const RING_R = 400;
const CX = 540;
const CY = ZONE.stageCenterY;
const BLOOM_START = 25;
const BLOOM_STEP = 13;
const CHASE_PERIOD = 108;

const NODES = Array.from({ length: NODE_COUNT }, (_, i) => {
  const deg = -90 + i * (360 / NODE_COUNT);
  const rad = (deg * Math.PI) / 180;
  return { i, deg, x: CX + RING_R * Math.cos(rad), y: CY + RING_R * Math.sin(rad) };
});

// Shortest angular distance in degrees, 0..180.
const angleGap = (a: number, b: number) => {
  const d = Math.abs(((a - b) % 360) + 360) % 360;
  return Math.min(d, 360 - d);
};

/**
 * Scene 3 (abs 626-995): 18 service nodes bloom around a circular event bus
 * that surrounds the board, with an amber pulse chasing around the ring.
 */
export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chaseDeg = -90 + ((frame % CHASE_PERIOD) / CHASE_PERIOD) * 360;
  const chaseRad = (chaseDeg * Math.PI) / 180;

  const shown = Math.max(
    0,
    Math.min(NODE_COUNT, Math.floor((frame - BLOOM_START) / BLOOM_STEP) + 1),
  );

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [0, 14, 350, 369], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      {/* The board, already complete, sitting inside the ring */}
      <div
        style={{
          position: "absolute",
          left: CX - 290,
          top: CY - 200,
          width: 580,
          height: 399,
          opacity: 0.9,
        }}
      >
        <Board progress={1} coreGlow={0.85} />
      </div>

      <AbsoluteFill>
        <svg viewBox="0 0 1080 1920" style={{ width: 1080, height: 1920 }}>
          {/* Event bus ring */}
          <circle
            cx={CX}
            cy={CY}
            r={RING_R}
            fill="none"
            stroke={COLORS.green}
            strokeWidth={3}
            opacity={interpolate(frame, [8, 40], [0, 0.35], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          />

          {/* Amber pulse chasing around the bus */}
          <circle
            cx={CX}
            cy={CY}
            r={RING_R}
            fill="none"
            stroke={COLORS.amber}
            strokeWidth={6}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="0.1 0.9"
            strokeDashoffset={-((frame % CHASE_PERIOD) / CHASE_PERIOD)}
            transform={`rotate(-90 ${CX} ${CY})`}
            opacity={interpolate(frame, [20, 60], [0, 0.75], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          />
          <circle
            cx={CX + RING_R * Math.cos(chaseRad)}
            cy={CY + RING_R * Math.sin(chaseRad)}
            r={13}
            fill={COLORS.gold}
            opacity={interpolate(frame, [20, 60], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          />

          {/* Service nodes */}
          {NODES.map((n) => {
            const bloom = spring({
              frame: frame - (BLOOM_START + n.i * BLOOM_STEP),
              fps,
              config: { damping: 13, mass: 0.6 },
            });
            const lit = Math.max(0, 1 - angleGap(n.deg, chaseDeg) / 24);

            return (
              <g key={n.i} opacity={bloom}>
                <line
                  x1={CX}
                  y1={CY}
                  x2={n.x}
                  y2={n.y}
                  stroke={COLORS.green}
                  strokeWidth={2}
                  opacity={0.12 + lit * 0.35}
                />
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={24 * Math.min(1.15, bloom) + lit * 7}
                  fill={COLORS.bg}
                  stroke={lit > 0.05 ? COLORS.amber : COLORS.green}
                  strokeWidth={5}
                />
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={10}
                  fill={lit > 0.05 ? COLORS.gold : COLORS.green}
                  opacity={0.55 + lit * 0.45}
                />
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>

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
          opacity: interpolate(frame, [10, 46], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        18 services. One bus.
      </div>

      {/* Live count as the nodes bloom */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: CY + RING_R + 130,
          textAlign: "center",
          fontFamily: FONT_MONO,
          fontSize: 44,
          letterSpacing: 6,
          color: COLORS.green,
          opacity: interpolate(frame, [20, 50], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {(shown < 10 ? "0" : "") + shown} / 18
      </div>
    </AbsoluteFill>
  );
};
