import React from "react";

// Generic 1980s tin-toy robot, drawn in the CRT screen's coordinate system
// (viewBox 0 0 680 510). Static — the robot stands still for the whole shot.
const FILL = "#2F4A22";
const EDGE = "#6FA84E";
const PANEL = "#4F7A3A";
const INSET = "#22381A";
const EYE = "#F5A623";

// Every prop defaults to the palette above and to a stroke scale of 1, so
// callers that pass nothing render exactly as before.
export const RetroRobot: React.FC<{
  fill?: string;
  edge?: string;
  panel?: string;
  inset?: string;
  eye?: string;
  shadow?: string;
  strokeScale?: number;
}> = ({
  fill = FILL,
  edge = EDGE,
  panel = PANEL,
  inset = INSET,
  eye = EYE,
  shadow = "#050B04",
  strokeScale = 1,
}) => (
  <g transform="translate(0 -22)">
    <defs>
      <radialGradient id="eyeGlow">
        <stop offset="0%" stopColor={eye} stopOpacity={0.8} />
        <stop offset="45%" stopColor={eye} stopOpacity={0.22} />
        <stop offset="100%" stopColor={eye} stopOpacity={0} />
      </radialGradient>
    </defs>

    {/* Contact shadow on the floor of the picture */}
    <ellipse cx={340} cy={474} rx={118} ry={13} fill={shadow} opacity={0.55} />

    {/* Antenna with ball finial */}
    <line
      x1={340}
      y1={150}
      x2={340}
      y2={106}
      stroke={edge}
      strokeWidth={4 * strokeScale}
      strokeLinecap="round"
    />
    <circle
      cx={340}
      cy={96}
      r={10}
      fill={fill}
      stroke={edge}
      strokeWidth={4 * strokeScale}
    />

    {/* Arms, drawn behind the torso */}
    {[
      { sx: 250, ux: 238, hx: 234 },
      { sx: 430, ux: 417, hx: 413 },
    ].map((a) => (
      <g key={a.sx}>
        <circle
          cx={a.sx}
          cy={276}
          r={13}
          fill={fill}
          stroke={edge}
          strokeWidth={3 * strokeScale}
        />
        <rect
          x={a.ux}
          y={282}
          width={25}
          height={54}
          rx={8}
          fill={fill}
          stroke={edge}
          strokeWidth={3 * strokeScale}
        />
        <circle
          cx={a.sx}
          cy={340}
          r={11}
          fill={fill}
          stroke={edge}
          strokeWidth={3 * strokeScale}
        />
        <rect
          x={a.ux}
          y={346}
          width={25}
          height={50}
          rx={8}
          fill={fill}
          stroke={edge}
          strokeWidth={3 * strokeScale}
        />
        <rect
          x={a.hx}
          y={398}
          width={33}
          height={20}
          rx={5}
          fill={fill}
          stroke={edge}
          strokeWidth={3 * strokeScale}
        />
      </g>
    ))}

    {/* Legs and feet */}
    <rect
      x={294}
      y={396}
      width={42}
      height={58}
      rx={6}
      fill={fill}
      stroke={edge}
      strokeWidth={3 * strokeScale}
    />
    <rect
      x={344}
      y={396}
      width={42}
      height={58}
      rx={6}
      fill={fill}
      stroke={edge}
      strokeWidth={3 * strokeScale}
    />
    <rect
      x={280}
      y={452}
      width={58}
      height={20}
      rx={5}
      fill={fill}
      stroke={edge}
      strokeWidth={3 * strokeScale}
    />
    <rect
      x={342}
      y={452}
      width={58}
      height={20}
      rx={5}
      fill={fill}
      stroke={edge}
      strokeWidth={3 * strokeScale}
    />
    <rect x={296} y={386} width={88} height={16} rx={4} fill={fill} />

    {/* Torso */}
    <rect
      x={268}
      y={260}
      width={144}
      height={132}
      rx={10}
      fill={fill}
      stroke={edge}
      strokeWidth={4 * strokeScale}
    />

    {/* Control panel detail */}
    <rect
      x={296}
      y={286}
      width={88}
      height={52}
      rx={5}
      fill={inset}
      stroke={edge}
      strokeWidth={2 * strokeScale}
    />
    {[312, 340, 368].map((cx) => (
      <circle key={cx} cx={cx} cy={302} r={6} fill={panel} />
    ))}
    <rect x={306} y={316} width={72} height={5} rx={2.5} fill={panel} />
    <rect
      x={306}
      y={326}
      width={48}
      height={5}
      rx={2.5}
      fill={panel}
      opacity={0.7}
    />

    {/* Neck */}
    <rect
      x={318}
      y={248}
      width={44}
      height={14}
      rx={3}
      fill={fill}
      stroke={edge}
      strokeWidth={3 * strokeScale}
    />

    {/* Head */}
    <rect
      x={278}
      y={148}
      width={124}
      height={100}
      rx={8}
      fill={fill}
      stroke={edge}
      strokeWidth={4 * strokeScale}
    />

    {/* Glowing eyes — the only warm colour in the frame */}
    {[310, 370].map((cx) => (
      <g key={cx}>
        <circle cx={cx} cy={190} r={30} fill="url(#eyeGlow)" />
        <circle cx={cx} cy={190} r={13} fill={eye} />
      </g>
    ))}

    {/* Mouth grille */}
    {[216, 225, 234].map((y) => (
      <rect key={y} x={302} y={y} width={76} height={5} rx={2.5} fill={edge} />
    ))}
  </g>
);
