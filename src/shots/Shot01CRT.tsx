import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { RetroRobot } from "./RetroRobot";

const ROOM = "#0A0908";
const HOUSING = "#2A241E";
const HOUSING_EDGE = "#4A4137";
const HOUSING_DARK = "#17130F";
const PHOSPHOR_BRIGHT = "#6FA84E";

// Screen box in page coordinates, and its own drawing space.
const SCR = { x: 200, y: 670, w: 680, h: 510, r: 58 };
const SW = SCR.w;
const SH = SCR.h;
const SCR_CX = SCR.x + SW / 2;
const SCR_CY = SCR.y + SH / 2;

const ROLL_PERIOD = 45; // one pass every 1.5s at 30fps
const SCAN_PITCH = 6; // scanline pattern height, in screen units

// Deterministic hash of an integer -> 0..1. Used for the irregular jitter so
// the same frame always produces the same offset.
const hash = (n: number) => {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
};

export const Shot01CRT: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Power-on: a thin line snaps in at frame 1, then expands to fill the tube.
  const lineIn = interpolate(frame, [0, 1], [0, 6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const openSpring = spring({
    frame: frame - 1,
    fps,
    config: { damping: 200 },
    durationInFrames: 5,
  });
  const openH = Math.max(
    lineIn,
    interpolate(openSpring, [0, 1], [0, SH], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  // White over-brightness: blown out on power-on, settled by frame 20.
  const flash = interpolate(frame, [0, 3, 6, 12, 20], [0.95, 0.9, 0.55, 0.22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.3, 1),
  });

  // How much light the tube throws into the room.
  const glow = interpolate(frame, [0, 3, 7, 20], [0, 0.6, 1, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Irregular horizontal jitter, held for two frames at a time.
  const jSlot = Math.floor(frame / 2);
  const jitterX =
    hash(jSlot) > 0.72 ? (hash(jSlot + 17) * 2 - 1) * 3.2 : 0;

  const rollY =
    ((frame % ROLL_PERIOD) / ROLL_PERIOD) * (SH + 150) - 150;

  return (
    <AbsoluteFill style={{ backgroundColor: ROOM }}>
      {/* Wall, slightly warmer near the set */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle 700px at ${SCR_CX}px 1060px, rgba(245,166,35,0.035) 0%, rgba(10,9,8,0) 70%)`,
        }}
      />

      {/* Tube light spilling onto the wall behind */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle 900px at ${SCR_CX}px ${SCR_CY}px, rgba(111,168,78,0.13) 0%, rgba(111,168,78,0.05) 35%, rgba(10,9,8,0) 70%)`,
          opacity: glow,
        }}
      />

      {/* Television set */}
      <AbsoluteFill>
        <svg viewBox="0 0 1080 1920" style={{ width: 1080, height: 1920 }}>
          {/* Pedestal */}
          <polygon points="432,1400 648,1400 692,1470 388,1470" fill="#241F1A" />
          <rect x={356} y={1468} width={388} height={28} rx={10} fill={HOUSING} />

          {/* Cabinet — deep 1980s moulding, thick walls and a tall chin */}
          <rect
            x={96}
            y={566}
            width={888}
            height={838}
            rx={56}
            fill={HOUSING}
            stroke={HOUSING_EDGE}
            strokeWidth={4}
          />
          {/* Lighter top edge of the moulding */}
          <rect
            x={120}
            y={586}
            width={840}
            height={6}
            rx={3}
            fill={HOUSING_EDGE}
            opacity={0.55}
          />

          {/* Recessed bezel, deeper along the bottom than the top */}
          <rect
            x={152}
            y={618}
            width={776}
            height={646}
            rx={64}
            fill={HOUSING_DARK}
          />

          {/* Speaker grille, on the chin below the tube */}
          {[1300, 1314, 1328, 1342].map((y) => (
            <rect
              key={y}
              x={196}
              y={y}
              width={430}
              height={6}
              rx={3}
              fill="#191510"
            />
          ))}

          {/* Tuning knobs */}
          {[745, 862].map((cx) => (
            <g key={cx}>
              <circle
                cx={cx}
                cy={1330}
                r={36}
                fill="#1E1A15"
                stroke={HOUSING_EDGE}
                strokeWidth={4}
              />
              <line
                x1={cx}
                y1={1330}
                x2={cx}
                y2={1304}
                stroke={HOUSING_EDGE}
                strokeWidth={5}
                strokeLinecap="round"
              />
            </g>
          ))}
        </svg>
      </AbsoluteFill>

      {/* The tube itself */}
      <div
        style={{
          position: "absolute",
          left: SCR.x,
          top: SCR.y,
          width: SW,
          height: SH,
          borderRadius: SCR.r,
          overflow: "hidden",
          backgroundColor: "#050604",
        }}
      >
        <svg viewBox={`0 0 ${SW} ${SH}`} style={{ width: SW, height: SH }}>
          <defs>
            <clipPath id="crtOpen">
              <rect x={0} y={(SH - openH) / 2} width={SW} height={openH} />
            </clipPath>
            <radialGradient id="screenBg" cx="50%" cy="46%" r="72%">
              <stop offset="0%" stopColor="#172A10" />
              <stop offset="100%" stopColor="#0A140A" />
            </radialGradient>
            <pattern
              id="scanlines"
              width={SW}
              height={SCAN_PITCH}
              patternUnits="userSpaceOnUse"
              patternTransform={`translate(0 ${(frame * 0.7) % SCAN_PITCH})`}
            >
              <rect
                x={0}
                y={0}
                width={SW}
                height={2.4}
                fill="#000000"
                opacity={0.38}
              />
            </pattern>
            <linearGradient id="rollBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0} />
              <stop offset="50%" stopColor="#ffffff" stopOpacity={0.13} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
            <radialGradient id="tubeVignette" cx="50%" cy="50%" r="74%">
              <stop offset="55%" stopColor="#000000" stopOpacity={0} />
              <stop offset="100%" stopColor="#000000" stopOpacity={0.62} />
            </radialGradient>
            {/* Grain: the seed is the frame number, so it is animated but
                reproducible for any given frame. */}
            <filter id="grain" x="0" y="0" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.85"
                numOctaves={1}
                seed={frame}
                result="noise"
              />
              <feColorMatrix type="saturate" values="0" />
              {/* Push the mid-grey noise down to sparse bright specks, and
                  force alpha to 1 so the screen blend below has a full plate. */}
              <feComponentTransfer>
                <feFuncR type="linear" slope="2.2" intercept="-0.85" />
                <feFuncG type="linear" slope="2.2" intercept="-0.85" />
                <feFuncB type="linear" slope="2.2" intercept="-0.85" />
                <feFuncA type="linear" slope="0" intercept="1" />
              </feComponentTransfer>
            </filter>
          </defs>

          <g clipPath="url(#crtOpen)">
            {/* Picture, offset by the horizontal jitter */}
            <g transform={`translate(${jitterX} 0)`}>
              <rect x={-8} y={0} width={SW + 16} height={SH} fill="url(#screenBg)" />
              <RetroRobot />
            </g>

            {/* Tube artefacts, fixed to the glass rather than the picture */}
            <rect width={SW} height={SH} fill="url(#scanlines)" />
            <rect x={0} y={rollY} width={SW} height={150} fill="url(#rollBand)" />
            <rect
              width={SW}
              height={SH}
              filter="url(#grain)"
              opacity={0.16}
              style={{ mixBlendMode: "screen" }}
            />
            <rect width={SW} height={SH} fill="url(#tubeVignette)" />
            <rect
              width={SW}
              height={SH}
              fill="#ffffff"
              opacity={flash}
            />
          </g>
        </svg>
      </div>

      {/* Tube light spilling forward onto the cabinet */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle 560px at ${SCR_CX}px ${SCR_CY}px, ${PHOSPHOR_BRIGHT}33 0%, ${PHOSPHOR_BRIGHT}12 45%, rgba(0,0,0,0) 75%)`,
          mixBlendMode: "screen",
          opacity: glow,
        }}
      />
    </AbsoluteFill>
  );
};
