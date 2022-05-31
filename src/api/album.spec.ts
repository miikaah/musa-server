import supertest from "supertest";
import { Api } from "musa-core";
import { app } from "../";
import { albumFixture } from "../../test-utils/album.fixture";

jest.mock("musa-core");

(Api.getAlbumById as jest.MockedFunction<typeof Api.getAlbumById>).mockResolvedValue(albumFixture);

const request = supertest(app);

describe("Album API tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /album/:id", () => {
    const id = "foo";
    const route = `/album/${id}`;

    it("should get 200 and the album", async () => {
      const response = await request.get(route).expect(200);

      expect(response.body).toEqual(albumFixture);
      expect(Api.getAlbumById).toHaveBeenCalledTimes(1);
      expect(Api.getAlbumById).toHaveBeenCalledWith(id);
    });

    it("should get 200 and an empty object if album doesn't exist", async () => {
      (Api.getAlbumById as jest.MockedFunction<typeof Api.getAlbumById>).mockResolvedValueOnce(
        <any>{}
      );

      const response = await request.get(route).expect(200);

      expect(response.body).toEqual({});
      expect(Api.getAlbumById).toHaveBeenCalledTimes(1);
      expect(Api.getAlbumById).toHaveBeenCalledWith(id);
    });
  });
});
