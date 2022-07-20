import { State } from "@miikaah/musa-core";

export const settingsPayloadFixture: { settings: State } = {
  settings: {
    isInit: null,
    currentTheme: {
      id: "Q01YXFJhdXRha2FudGVsZVxSYXV0YWthbnRlbGUuanBn",
      filename: "CMX\\Rautakantele\\Rautakantele.jpg",
      colors: {
        bg: [38, 35, 31],
        primary: [202, 204, 187],
        secondary: [138, 134, 116],
        typography: "#fbfbfb",
        typographyGhost: "#d2d2d2",
        typographyPrimary: "#000",
        typographySecondary: "#fbfbfb",
        slider: [202, 204, 187],
      },
    },
    key: "state",
    replaygainType: "album",
    volume: 83,
    musicLibraryPath: "",
  },
};

export const settingsFixture: State = settingsPayloadFixture.settings;
