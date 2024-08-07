import supertest from "supertest";
import { Api } from "../musa-core-import";

import { app } from "../";
import { audioFixture } from "../../test-utils/audio.fixture";

vi.mock("../musa-core-import");
vi.mocked(Api.findAudioById).mockResolvedValue(audioFixture);

const request = supertest(app);

describe("Audio API tests", () => {
  describe("GET /audios/:id", () => {
    const id = "foo";
    const route = `/audios/${id}`;

    it("should return 200 and the audio", async () => {
      const response = await request.get(route);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(audioFixture);
      expect(Api.findAudioById).toHaveBeenCalledTimes(1);
      expect(Api.findAudioById).toHaveBeenCalledWith({ id });
    });

    it("should return 200 and an empty object if audio doesn't exist", async () => {
      vi.mocked(Api.findAudioById).mockResolvedValueOnce(undefined);

      const response = await request.get(route);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Not found" });
      expect(Api.findAudioById).toHaveBeenCalledTimes(1);
      expect(Api.findAudioById).toHaveBeenCalledWith({ id });
    });

    it("should return 500 if findAudioById throws an error", async () => {
      vi.mocked(Api.findAudioById).mockRejectedValueOnce(new Error("err"));

      const response = await request.get(route);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Internal Server Error" });
      expect(Api.findAudioById).toHaveBeenCalledTimes(1);
    });
  });
});
