import supertest from "supertest";
import { Api } from "musa-core";
import { app } from "../";
import { audioFixture } from "../../test-utils/audio.fixture";

jest.mock("musa-core");

(Api.getAudioById as jest.MockedFunction<typeof Api.getAudioById>).mockResolvedValue(audioFixture);

const request = supertest(app);

describe("Audio API tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /audio/:id", () => {
    const id = "foo";
    const route = `/audio/${id}`;

    it("should get 200 and the audio", async () => {
      const response = await request.get(route).expect(200);

      expect(response.body).toEqual(audioFixture);
      expect(Api.getAudioById).toHaveBeenCalledTimes(1);
      expect(Api.getAudioById).toHaveBeenCalledWith({ id });
    });

    it("should get 200 and an empty object if audio doesn't exist", async () => {
      (Api.getAudioById as jest.MockedFunction<typeof Api.getAudioById>).mockResolvedValueOnce(
        <any>{}
      );

      const response = await request.get(route).expect(200);

      expect(response.body).toEqual({});
      expect(Api.getAudioById).toHaveBeenCalledTimes(1);
      expect(Api.getAudioById).toHaveBeenCalledWith({ id });
    });
  });
});
