// Hand-placed burned-in captions. Frames are ABSOLUTE (30fps) and each line is
// held inside its scene's narration range, so nothing overlaps a gap.
//
// Text is the real voiceover transcript, split across the existing windows so
// each line is on screen while it is being spoken.

export type CaptionLine = {
  from: number;
  to: number;
  text: string;
  /**
   * Frames in which this exact line is already on screen as a scene headline.
   * The caption is suppressed here so the line is never doubled. Retune this
   * to match the headline if the headline's timing changes.
   */
  hiddenBetween?: readonly [number, number];
};

export const CAPTIONS: CaptionLine[] = [
  // scene1.wav — 45..220
  // "Hi. I'm Bingo. I live in this house. Want to see what I'm made of?"
  { from: 45, to: 100, text: "Hi. I'm Bingo." },
  { from: 102, to: 158, text: "I live in this house." },
  { from: 160, to: 220, text: "Want to see what I'm made of?" },

  // scene2.wav — 233..595
  // "This is my brain. One board, sitting in a cupboard upstairs. Everything I
  //  hear, see, remember and say happens right here. Nothing leaves the house.
  //  Ever."
  { from: 233, to: 302, text: "This is my brain." },
  { from: 305, to: 385, text: "One board, sitting in a cupboard upstairs." },
  { from: 388, to: 456, text: "Everything I hear, see, remember and say" },
  { from: 459, to: 528, text: "happens right here." },
  { from: 531, to: 595, text: "Nothing leaves the house. Ever." },

  // scene3.wav — 626..983
  // "Inside it, eighteen little programs, all shouting at each other on one
  //  bus. One listens. One looks. One remembers your name. One decides what I
  //  say back."
  { from: 626, to: 712, text: "Inside it, eighteen little programs," },
  { from: 715, to: 800, text: "all shouting at each other on one bus." },
  { from: 803, to: 890, text: "One listens. One looks. One remembers your name." },
  { from: 893, to: 983, text: "One decides what I say back." },

  // scene4.wav — 996..1326
  // "The screens around the house aren't other dogs. They're just my ears and
  //  eyes. Every one of them sends the thinking home to that same board."
  { from: 996, to: 1078, text: "The screens around the house aren't other dogs." },
  { from: 1081, to: 1160, text: "They're just my ears and eyes." },
  { from: 1163, to: 1244, text: "Every one of them sends the thinking" },
  { from: 1247, to: 1326, text: "home to that same board." },

  // scene5.wav — 1339..1619
  // "So there is only ever one me. One soul. Many bodies. My human is still
  //  building the rest. Follow along. I'll be here."
  { from: 1339, to: 1432, text: "So there is only ever one me." },
  // Scene 5's headline says this too, from its fade-in at 1409 to the end of
  // the composition, so the caption stays suppressed for its whole window.
  {
    from: 1435,
    to: 1526,
    text: "One soul. Many bodies.",
    hiddenBetween: [1409, 1679],
  },
  {
    from: 1529,
    to: 1619,
    text: "My human is still building the rest. Follow along. I'll be here.",
  },
];
