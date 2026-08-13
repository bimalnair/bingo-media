import React from "react";
import { COLORS, stage } from "../theme";

// Traces fanning out from the SoC to the board edges.
const TRACES = [
  "M 230 200 H 130 V 96 H 66",
  "M 230 244 H 156 V 344 H 78",
  "M 410 200 H 516 V 108 H 578",
  "M 410 252 H 502 V 336 H 570",
  "M 320 110 V 66 H 204",
  "M 356 290 V 348 H 452 V 398",
  "M 284 290 V 326 H 214 V 398",
];

// Small support chips around the SoC.
const CHIPS = [
  { x: 92, y: 128, w: 74, h: 44 },
  { x: 474, y: 128, w: 74, h: 44 },
  { x: 92, y: 268, w: 62, h: 38 },
  { x: 486, y: 268, w: 62, h: 38 },
];

const FIN_XS = [252, 272, 292, 312, 332, 352, 372];
const PAD_XS = [
  204, 220, 236, 252, 268, 284, 300, 316, 332, 348, 364, 380, 396, 412, 428,
];

/**
 * NVIDIA Jetson AGX Orin board that draws itself in.
 * `progress` 0..1 runs the whole draw-in; `coreGlow` 0..1 fades the green core glow.
 * All geometry is static — only stroke offsets and opacities depend on the props.
 */
export const Board: React.FC<{ progress: number; coreGlow: number }> = ({
  progress,
  coreGlow,
}) => {
  const outline = stage(progress, 0, 0.3);
  const traces = stage(progress, 0.18, 0.6);
  const pads = stage(progress, 0.46, 0.72);
  const soc = stage(progress, 0.6, 0.86);
  const fins = stage(progress, 0.74, 0.96);

  return (
    <svg
      viewBox="0 0 640 440"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
    >
      <defs>
        <radialGradient id="coreGlow">
          <stop offset="0%" stopColor={COLORS.green} stopOpacity={0.55} />
          <stop offset="55%" stopColor={COLORS.green} stopOpacity={0.14} />
          <stop offset="100%" stopColor={COLORS.green} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Green glow building at the core */}
      <circle
        cx={320}
        cy={200}
        r={210}
        fill="url(#coreGlow)"
        opacity={coreGlow}
      />

      {/* PCB outline */}
      <rect
        x={20}
        y={20}
        width={600}
        height={400}
        rx={20}
        fill="none"
        stroke={COLORS.green}
        strokeWidth={4}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - outline}
        opacity={0.9}
      />

      {/* Mounting holes */}
      {[
        [64, 64],
        [576, 64],
        [64, 376],
        [576, 376],
      ].map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={11}
          fill="none"
          stroke={COLORS.green}
          strokeWidth={3}
          opacity={outline * 0.7}
        />
      ))}

      {/* Traces */}
      {TRACES.map((d, i) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke={COLORS.green}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.55}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - stage(traces, i * 0.07, 0.5 + i * 0.07)}
        />
      ))}

      {/* Support chips */}
      {CHIPS.map((c) => (
        <rect
          key={`${c.x}-${c.y}`}
          x={c.x}
          y={c.y}
          width={c.w}
          height={c.h}
          rx={4}
          fill="none"
          stroke={COLORS.green}
          strokeWidth={3}
          opacity={pads * 0.75}
        />
      ))}

      {/* Edge connector pads along the bottom */}
      {PAD_XS.map((x, i) => (
        <rect
          key={x}
          x={x}
          y={402}
          width={9}
          height={18}
          rx={2}
          fill={COLORS.gold}
          opacity={stage(pads, i * 0.035, 0.35 + i * 0.035) * 0.85}
        />
      ))}

      {/* Central SoC package */}
      <rect
        x={230}
        y={110}
        width={180}
        height={180}
        rx={10}
        fill={COLORS.bg}
        stroke={COLORS.green}
        strokeWidth={5}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - soc}
        opacity={soc > 0 ? 1 : 0}
      />

      {/* Heatsink fins */}
      {FIN_XS.map((x, i) => (
        <line
          key={x}
          x1={x}
          y1={126}
          x2={x}
          y2={274}
          stroke={COLORS.green}
          strokeWidth={5}
          strokeLinecap="round"
          opacity={stage(fins, i * 0.09, 0.4 + i * 0.09) * 0.8}
        />
      ))}
    </svg>
  );
};
