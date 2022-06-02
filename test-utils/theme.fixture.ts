import { Theme } from "musa-core";

export const themeFixture: Theme = {
  id: "QXQgVGhlIEdhdGVzXFNsYXVnaHRlcm91cyBTb3Vsc1xTbGF1Z2h0ZXJvdXMgU291bHMuanBn",
  filename: "At The Gates\\Slaughterous Souls\\Slaughterous Souls.jpg",
  colors: {
    bg: [33, 44, 30],
    primary: [200, 198, 204],
    secondary: [126, 125, 124],
    typography: "#fbfbfb",
    typographyGhost: "#d2d2d2",
    typographyPrimary: "#000",
    typographySecondary: "#fbfbfb",
    slider: [200, 198, 204],
  },
};

export const themePayloadFixture: Pick<Theme, "colors"> = {
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
};
