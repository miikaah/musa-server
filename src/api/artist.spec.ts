import supertest from "supertest";
import { Api } from "musa-core";
import { app } from "../";
import {
  artistFixture,
  artistsFixture,
  artistAlbumsFixture,
} from "../../test-utils/artist.fixture";

jest.mock("musa-core");

(Api.getArtistById as jest.MockedFunction<typeof Api.getArtistById>).mockResolvedValue(
  artistFixture
);
(Api.getArtists as jest.MockedFunction<typeof Api.getArtists>).mockResolvedValue(artistsFixture);
(Api.getArtistAlbums as jest.MockedFunction<typeof Api.getArtistAlbums>).mockResolvedValue(
  artistAlbumsFixture
);

const request = supertest(app);

describe("Artist API tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /artist/:id", () => {
    const id = "foo";
    const route = `/artist/${id}`;

    it("should get 200 and the artist", async () => {
      const response = await request.get(route).expect(200);

      expect(response.body).toEqual(artistFixture);
      expect(Api.getArtistById).toHaveBeenCalledTimes(1);
      expect(Api.getArtistById).toHaveBeenCalledWith(id);
    });

    it("should get 200 and an empty object if artist doesn't exist", async () => {
      (Api.getArtistById as jest.MockedFunction<typeof Api.getArtistById>).mockResolvedValueOnce(
        <any>{}
      );

      const response = await request.get(route).expect(200);

      expect(response.body).toEqual({});
      expect(Api.getArtistById).toHaveBeenCalledTimes(1);
      expect(Api.getArtistById).toHaveBeenCalledWith(id);
    });
  });

  describe("GET /artists", () => {
    const route = `/artists`;

    it("should get 200 and the artist", async () => {
      const response = await request.get(route).expect(200);

      expect(response.body).toEqual(artistsFixture);
      expect(Api.getArtists).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /artist-albums/:id", () => {
    const route = `/artist-albums/:id`;

    it("should get 200 and the artist", async () => {
      const response = await request.get(route).expect(200);

      expect(response.body).toEqual(artistAlbumsFixture);
      expect(Api.getArtistAlbums).toHaveBeenCalledTimes(1);
    });
  });
});
