import supertest from "supertest";
import { Api } from "../musa-core-import";

import { app } from "../";
import { albumFixture } from "../../test-utils/album.fixture";

vi.mock("../musa-core-import");
vi.mocked(Api.findAlbumById).mockResolvedValue(albumFixture);

const request = supertest(app);

describe("Album API tests", () => {
  describe("GET /albums/:id", () => {
    const id = "foo";
    const route = `/albums/${id}`;

    it("should return 200 and the album", async () => {
      const response = await request.get(route);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(albumFixture);
      expect(Api.findAlbumById).toHaveBeenCalledTimes(1);
      expect(Api.findAlbumById).toHaveBeenCalledWith(id);
    });

    it("should return 404 if album doesn't exist", async () => {
      vi.mocked(Api.findAlbumById).mockResolvedValueOnce(undefined);

      const response = await request.get(route);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Not found" });
      expect(Api.findAlbumById).toHaveBeenCalledTimes(1);
      expect(Api.findAlbumById).toHaveBeenCalledWith(id);
    });

    it("should return 500 if findAlbumById throws an error", async () => {
      vi.mocked(Api.findAlbumById).mockRejectedValueOnce(new Error("err"));

      const response = await request.get(route);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Internal Server Error" });
      expect(Api.findAlbumById).toHaveBeenCalledTimes(1);
      expect(Api.findAlbumById).toHaveBeenCalledWith(id);
    });
  });
});
