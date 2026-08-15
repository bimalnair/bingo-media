import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Background } from "./components/Background";
import { Captions } from "./components/Captions";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";
import { Scene5 } from "./scenes/Scene5";
import { COLORS } from "./theme";

/**
 * BingoIntro — 1080x1920, 30fps, 1680 frames.
 *
 * Absolute timeline:
 *   0-44      intro beat, no narration
 *   45-220    scene1.wav
 *   221-232   gap
 *   233-595   scene2.wav
 *   596-625   gap (bark lands here)
 *   626-983   scene3.wav
 *   984-995   gap
 *   996-1326  scene4.wav
 *   1327-1338 gap
 *   1339-1619 scene5.wav
 *   1620-1679 outro card holds
 */
export const BingoIntro: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Background />

      {/* ---------------- Visuals ---------------- */}
      <Sequence durationInFrames={233} name="Scene 1 — Pulse">
        <Scene1 />
      </Sequence>
      <Sequence from={233} durationInFrames={393} name="Scene 2 — Board">
        <Scene2 />
      </Sequence>
      <Sequence from={626} durationInFrames={370} name="Scene 3 — Services">
        <Scene3 />
      </Sequence>
      <Sequence from={996} durationInFrames={343} name="Scene 4 — Satellites">
        <Scene4 />
      </Sequence>
      <Sequence from={1339} durationInFrames={341} name="Scene 5 — One soul">
        <Scene5 />
      </Sequence>

      {/* ---------------- Narration ---------------- */}
      <Sequence from={45} durationInFrames={176} name="VO 1">
        <Audio src={staticFile("vo/scene1.wav")} />
      </Sequence>
      <Sequence from={233} durationInFrames={363} name="VO 2">
        <Audio src={staticFile("vo/scene2.wav")} />
      </Sequence>
      <Sequence from={626} durationInFrames={358} name="VO 3">
        <Audio src={staticFile("vo/scene3.wav")} />
      </Sequence>
      <Sequence from={996} durationInFrames={331} name="VO 4">
        <Audio src={staticFile("vo/scene4.wav")} />
      </Sequence>
      <Sequence from={1339} durationInFrames={281} name="VO 5">
        <Audio src={staticFile("vo/scene5.wav")} />
      </Sequence>

      {/* ---------------- SFX ---------------- */}
      {/* Source is 14.472s; trimmed to the 1.5s intro before narration starts.
          That head peaks at only -21.2 dBFS, so it is amplified to land just
          under -3.6 dBFS peak — nothing else is playing here to sum with. */}
      <Sequence durationInFrames={45} name="SFX jingle">
        <Audio src={staticFile("sfx/jingle.mp3")} volume={7.5} />
      </Sequence>
      {/* Source is 1.032s; trimmed to end with the gap at 625 so it does not
          ring over the start of scene 3's narration. */}
      <Sequence from={600} durationInFrames={26} name="SFX bark">
        <Audio src={staticFile("sfx/bark.mp3")} volume={0.6} />
      </Sequence>
      {/* Source is 9.552s, shorter than this 370-frame window, so it loops. */}
      <Sequence from={626} durationInFrames={370} name="SFX panting">
        <Audio src={staticFile("sfx/panting.mp3")} volume={0.15} loop />
      </Sequence>
      {/* Source is 5.352s; trimmed to the outro card, which ends the video.
          Its loudest events are at 1.75s and 2.50s, past the head this window
          would otherwise keep, so playback starts at frame 51 (1.70s) — just
          before the 1.75s attack. */}
      <Sequence from={1625} durationInFrames={55} name="SFX huff">
        <Audio
          src={staticFile("sfx/huff.mp3")}
          volume={0.5}
          trimBefore={51}
        />
      </Sequence>

      {/* ---------------- Burned-in captions ---------------- */}
      <Captions />
    </AbsoluteFill>
  );
};
