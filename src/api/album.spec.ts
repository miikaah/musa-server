import supertest from "supertest";
import { Api } from "../musa-core-import";

import { app } from "../";
import { albumFixture } from "../../test-utils/album.fixture";

vi.mock("../musa-core-import");
vi.mocked(Api.getAlbumById).mockResolvedValue(albumFixture);

const request = supertest(app);

describe("Album API tests", () => {
  describe("GET /albums/:id", () => {
    const id = "foo";
    const route = `/albums/${id}`;

    it("should return 200 and the album", async () => {
      const response = await request.get(route);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(albumFixture);
      expect(Api.getAlbumById).toHaveBeenCalledTimes(1);
      expect(Api.getAlbumById).toHaveBeenCalledWith(id);
    });

    it("should return 200 and an empty object if album doesn't exist", async () => {
      vi.mocked(Api.getAlbumById).mockResolvedValueOnce(<any>{});

      const response = await request.get(route);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({});
      expect(Api.getAlbumById).toHaveBeenCalledTimes(1);
      expect(Api.getAlbumById).toHaveBeenCalledWith(id);
    });

    it("should return 500 if getAlbumById throws an error", async () => {
      vi.mocked(Api.getAlbumById).mockRejectedValueOnce(new Error("err"));

      const response = await request.get(route);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Internal Server Error" });
      expect(Api.getAlbumById).toHaveBeenCalledTimes(1);
      expect(Api.getAlbumById).toHaveBeenCalledWith(id);
    });
  });
});
