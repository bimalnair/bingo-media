import React from "react";
import { Composition } from "remotion";
import { BingoIntro } from "./BingoIntro";
import { Shot01CRT } from "./shots/Shot01CRT";
import { Shot05Genesis } from "./shots/Shot05Genesis";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BingoIntro"
        component={BingoIntro}
        durationInFrames={1680}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Shot01CRT"
        component={Shot01CRT}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Shot05Genesis"
        component={Shot05Genesis}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
