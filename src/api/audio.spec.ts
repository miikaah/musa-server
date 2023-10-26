import supertest from "supertest";
import { Api } from "../musa-core-import";

import { app } from "../";
import { audioFixture } from "../../test-utils/audio.fixture";

vi.mock("../musa-core-import");
vi.mocked(Api.getAudioById).mockResolvedValue(audioFixture);

const request = supertest(app);

describe("Audio API tests", () => {
  describe("GET /audios/:id", () => {
    const id = "foo";
    const route = `/audios/${id}`;

    it("should return 200 and the audio", async () => {
      const response = await request.get(route);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(audioFixture);
      expect(Api.getAudioById).toHaveBeenCalledTimes(1);
      expect(Api.getAudioById).toHaveBeenCalledWith({ id });
    });

    it("should return 200 and an empty object if audio doesn't exist", async () => {
      vi.mocked(Api.getAudioById).mockResolvedValueOnce(<any>{});

      const response = await request.get(route);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({});
      expect(Api.getAudioById).toHaveBeenCalledTimes(1);
      expect(Api.getAudioById).toHaveBeenCalledWith({ id });
    });

    it("should return 500 if getAudioById throws an error", async () => {
      vi.mocked(Api.getAudioById).mockRejectedValueOnce(new Error("err"));

      const response = await request.get(route);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Internal Server Error" });
      expect(Api.getAudioById).toHaveBeenCalledTimes(1);
    });
  });
});
