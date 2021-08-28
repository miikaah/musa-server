import { traverseFileSystem } from "./fs";

const { MUSA_SRC_PATH = "" } = process.env;

describe("fs", () => {
  describe("traverseFileSystem()", () => {
    it("should build a list of files in the given dir", async () => {
      const files = await traverseFileSystem(`${MUSA_SRC_PATH}/fixtures`);

      expect(files).toEqual([
        "artist/album/cover.JPG",
        "artist/album/song.mp3",
        "artist/image.PNG",
        "artist/song.mp3",
      ]);
    });
  });
});
