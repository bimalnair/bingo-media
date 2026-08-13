import React from "react";
import { Composition } from "remotion";
import { BingoIntro } from "./BingoIntro";

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
    </>
  );
};
