import React from "react";
import {
  AbsoluteFill,
  Freeze,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { RetroRobot } from "./RetroRobot";

const BG = "#0B0907";
const AMBER = "#F5A623";

// Footage is 1680x944. Scaled down to 1080 wide (0.643x) it is 606.86 tall —
// no upscaling, no cropping. The viewport is fixed for the whole shot.
const PANEL_W = 1080;
const PANEL_H = (1080 * 944) / 1680;
const PANEL_Y = 600; // puts the panel centre at y=903, just above the frame's 960

const videoStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export const Shot05Genesis: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ghost robot: fades in over f14-26, holds to f36, gone by f45.
  const ghostIn = spring({
    frame: frame - 14,
    fps,
    config: { damping: 200 },
    durationInFrames: 12,
  });
  const ghostOut = interpolate(frame, [36, 45], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ghostRaw = ghostIn * ghostOut;
  const ghost = ghostRaw * 0.95;

  // While the ghost is up, push the sketch back so the amber robot reads as
  // sitting in front of it. Both are back to 1 by f45, so later clips are
  // untouched.
  const sketchFilter = `brightness(${1 - 0.55 * ghostRaw}) saturate(${1 - 0.6 * ghostRaw})`;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* Faint technical grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, rgba(240,233,222,0.035) 0px, rgba(240,233,222,0.035) 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, rgba(240,233,222,0.035) 0px, rgba(240,233,222,0.035) 1px, transparent 1px, transparent 60px)`,
        }}
      />
      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 72% 52% at 50% 47%, rgba(11,9,7,0) 0%, rgba(0,0,0,0.6) 100%)`,
        }}
      />

      {/* Viewport */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: PANEL_Y,
          width: PANEL_W,
          height: PANEL_H,
          borderRadius: 28,
          overflow: "hidden",
          backgroundColor: "#000000",
        }}
      >
        {/* f0-45 — static sketch, held on one frame for the full 1.5s */}
        <Sequence durationInFrames={45} name="sketch">
          <Freeze frame={0}>
            <OffthreadVideo
              src={staticFile("footage/s05a_sketch.mp4")}
              style={{ ...videoStyle, filter: sketchFilter }}
            />
          </Freeze>
        </Sequence>

        {/* f45-65 — exactly the source's 0.667s, so it plays out with no
            freeze. The 10 frames this frees up go to ring13 below. */}
        <Sequence from={45} durationInFrames={20} name="ring1">
          <OffthreadVideo
            src={staticFile("footage/s05b_ring1.mp4")}
            style={videoStyle}
          />
        </Sequence>

        {/* f65-102 — starting at 0.10s skips the tiny opening frames; the
            37-frame slot now plays almost the whole 1.375s source. */}
        <Sequence from={65} durationInFrames={37} name="ring13">
          <OffthreadVideo
            src={staticFile("footage/s05c_ring13.mp4")}
            style={videoStyle}
            trimBefore={3}
          />
        </Sequence>

        {/* f102-126 — t=0.30-1.10s is the legible stretch: the body is large
            and readable. It goes to an extreme close-up after t=1.1s. */}
        <Sequence from={102} durationInFrames={24} name="base">
          <OffthreadVideo
            src={staticFile("footage/s05d_base.mp4")}
            style={videoStyle}
            trimBefore={9}
          />
        </Sequence>

        {/* f126-150 — the final beat, held to the end. The explosion keeps
            separating for the whole 10s source, so the beat runs the last
            0.8s (9.17-9.97s): bezel, internals, body, base and speaker
            module are all distinct, and it stops just short of the final
            frame so nothing freezes. */}
        <Sequence from={126} durationInFrames={24} name="exploded">
          <OffthreadVideo
            src={staticFile("footage/s05f_exploded.mp4")}
            style={videoStyle}
            trimBefore={275}
          />
        </Sequence>

        {/* The ghost of the Shot 1 robot, amber outlines only, over the sketch */}
        <Sequence durationInFrames={45} layout="none" name="ghost">
          {/* The viewBox is cropped to the robot so it scales up to ~540px
              of the 607px panel, sitting slightly high (26px of headroom,
              41px below the feet). */}
          <svg
            viewBox="90 44 500 437"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: PANEL_W,
              height: PANEL_H,
              opacity: ghost,
            }}
          >
            <defs>
              <filter
                id="amberGlow"
                x="-40%"
                y="-40%"
                width="180%"
                height="180%"
              >
                <feGaussianBlur in="SourceAlpha" stdDeviation="7" result="b" />
                <feFlood
                  floodColor={AMBER}
                  floodOpacity="0.85"
                  result="flood"
                />
                <feComposite in="flood" in2="b" operator="in" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g filter="url(#amberGlow)">
              <RetroRobot
                fill="none"
                edge={AMBER}
                panel="none"
                inset="none"
                eye={AMBER}
                shadow="none"
                strokeScale={1.1}
              />
            </g>
          </svg>
        </Sequence>
      </div>

      {/* Viewport border and outer glow, drawn over the footage */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: PANEL_Y,
          width: PANEL_W,
          height: PANEL_H,
          boxSizing: "border-box",
          borderRadius: 28,
          border: "2px solid rgba(240,233,222,0.16)",
          boxShadow:
            "0 0 70px 10px rgba(245,166,35,0.07), 0 26px 70px rgba(0,0,0,0.8)",
        }}
      />
    </AbsoluteFill>
  );
};
