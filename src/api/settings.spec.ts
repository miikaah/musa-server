import supertest from "supertest";
import { Fs } from "musa-core";

import { app } from "../";
import { settingsFixture, settingsPayloadFixture } from "../../test-utils/settings.fixture";

jest.mock("musa-core");
(Fs.getState as jest.MockedFunction<typeof Fs.getState>).mockResolvedValue(settingsFixture);

const request = supertest(app);

describe("Settings API tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /state", () => {
    const route = `/state`;

    it("should return 200 and the state", async () => {
      const response = await request.get(route).expect(200);

      expect(response.body).toEqual(settingsFixture);
      expect(Fs.getState).toHaveBeenCalledTimes(1);
      expect(Fs.getState).toHaveBeenCalledWith(expect.any(String));
    });

    it("should return 404 if the settings file doesn't exist", async () => {
      (Fs.getState as jest.MockedFunction<typeof Fs.getState>).mockResolvedValueOnce(undefined);

      const response = await request.get(route).expect(404);

      expect(response.body).toEqual({ message: "Not Found" });
      expect(Fs.getState).toHaveBeenCalledTimes(1);
      expect(Fs.getState).toHaveBeenCalledWith(expect.any(String));
    });

    it("should return 500 if Fs.getState throws an error", async () => {
      (Fs.getState as jest.MockedFunction<typeof Fs.getState>).mockImplementationOnce(() => {
        throw new Error("err");
      });

      const response = await request.get(route).expect(500);

      expect(response.body).toEqual({ message: "Internal Server Error" });
      expect(Fs.getState).toHaveBeenCalledTimes(1);
      expect(Fs.getState).toHaveBeenCalledWith(expect.any(String));
    });
  });

  describe("PUT /state", () => {
    const route = `/state`;

    it("should return 200 and the state", async () => {
      const response = await request.put(route).send(settingsPayloadFixture).expect(200);

      expect(response.body).toEqual(settingsFixture);
      expect(Fs.setState).toHaveBeenCalledTimes(1);
      expect(Fs.setState).toHaveBeenCalledWith(expect.any(String), settingsFixture);
    });

    it("should return 500 if Fs.setState throws an error", async () => {
      (Fs.setState as jest.MockedFunction<typeof Fs.setState>).mockImplementationOnce(() => {
        throw new Error("err");
      });

      const response = await request.put(route).send(settingsPayloadFixture).expect(500);

      expect(response.body).toEqual({ message: "Internal Server Error" });
      expect(Fs.setState).toHaveBeenCalledTimes(1);
      expect(Fs.setState).toHaveBeenCalledWith(expect.any(String), settingsFixture);
    });
  });
});
