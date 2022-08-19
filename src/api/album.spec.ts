import supertest from "supertest";
import { Api } from "@miikaah/musa-core";

import { app } from "../";
import { albumFixture } from "../../test-utils/album.fixture";

jest.mock("@miikaah/musa-core");
jest.mocked(Api.getAlbumById).mockResolvedValue(albumFixture);

const request = supertest(app);

describe("Album API tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /album/:id", () => {
    const id = "foo";
    const route = `/album/${id}`;

    it("should return 200 and the album", async () => {
      const response = await request.get(route);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(albumFixture);
      expect(Api.getAlbumById).toHaveBeenCalledTimes(1);
      expect(Api.getAlbumById).toHaveBeenCalledWith(id);
    });

    it("should return 200 and an empty object if album doesn't exist", async () => {
      jest.mocked(Api.getAlbumById).mockResolvedValueOnce(<any>{});

      const response = await request.get(route);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({});
      expect(Api.getAlbumById).toHaveBeenCalledTimes(1);
      expect(Api.getAlbumById).toHaveBeenCalledWith(id);
    });

    it("should return 500 if getAlbumById throws an error", async () => {
      jest.mocked(Api.getAlbumById).mockRejectedValueOnce(new Error("err"));

      const response = await request.get(route);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Internal Server Error" });
      expect(Api.getAlbumById).toHaveBeenCalledTimes(1);
      expect(Api.getAlbumById).toHaveBeenCalledWith(id);
    });
  });
});
