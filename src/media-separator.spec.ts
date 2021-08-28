import { createMediaCollection } from "./media-separator";

const fixture = [
  "artist/album/cover.JPG",
  "artist/album/song.mp3",
  "artist/image.PNG",
  "artist/song.mp3",
];

describe("Media Separator", () => {
  describe("createMediaCollection()", () => {
    it("should separate files to collections", async () => {
      expect(createMediaCollection(fixture)).toMatchSnapshot();
    });
  });
});
