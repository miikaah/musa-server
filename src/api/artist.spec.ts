import supertest from "supertest";
import { Api } from "../musa-core-import";

import { app } from "../";
import {
  artistAlbumsFixture,
  artistFixture,
  artistsFixture,
} from "../../test-utils/artist.fixture";

vi.mock("../musa-core-import");
vi.mocked(Api.getArtistById).mockResolvedValue(artistFixture);
vi.mocked(Api.getArtists).mockResolvedValue(artistsFixture);
vi.mocked(Api.getArtistAlbums).mockResolvedValue(artistAlbumsFixture);

const request = supertest(app);

describe("Artist API tests", () => {
  describe("GET /artists/:id", () => {
    const id = "foo";
    const route = `/artists/${id}`;

    it("should return 200 and the artist", async () => {
      const response = await request.get(route);

      expect(response.body).toEqual(artistFixture);
      expect(Api.getArtistById).toHaveBeenCalledTimes(1);
      expect(Api.getArtistById).toHaveBeenCalledWith(id);
    });

    it("should return 500 if getArtistById throws an error", async () => {
      vi.mocked(Api.getArtistById).mockRejectedValueOnce(new Error("err"));

      const response = await request.get(route);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Internal Server Error" });
      expect(Api.getArtistById).toHaveBeenCalledTimes(1);
      expect(Api.getArtistById).toHaveBeenCalledWith(id);
    });
  });

  describe("GET /artists", () => {
    const route = `/artists`;

    it("should return 200 and the artist", async () => {
      const response = await request.get(route);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(artistsFixture);
      expect(Api.getArtists).toHaveBeenCalledTimes(1);
    });

    it("should return 500 if getArtists throws an error", async () => {
      vi.mocked(Api.getArtists).mockRejectedValueOnce(new Error("err"));

      const response = await request.get(route);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Internal Server Error" });
      expect(Api.getArtists).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /artists/:id/albums", () => {
    const route = `/artists/:id/albums`;

    it("should return 200 and the artist", async () => {
      const response = await request.get(route);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(artistAlbumsFixture);
      expect(Api.getArtistAlbums).toHaveBeenCalledTimes(1);
    });

    it("should return 500 if getArtistAlbums throws an error", async () => {
      vi.mocked(Api.getArtistAlbums).mockRejectedValueOnce(new Error("err"));

      const response = await request.get(route);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Internal Server Error" });
      expect(Api.getArtistAlbums).toHaveBeenCalledTimes(1);
    });
  });
});
