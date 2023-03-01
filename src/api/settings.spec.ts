import supertest from "supertest";
import { Fs } from "../musa-core-import";

import { app } from "../";
import { settingsFixture, settingsPayloadFixture } from "../../test-utils/settings.fixture";

jest.mock("../musa-core-import");
jest.mocked(Fs.getState).mockResolvedValue(settingsFixture);

const request = supertest(app);

describe("Settings API tests", () => {
  const route = `/app-settings`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe(`GET ${route}`, () => {
    it("should return 200 and the settings", async () => {
      const response = await request.get(route);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(settingsFixture);
      expect(Fs.getState).toHaveBeenCalledTimes(1);
      expect(Fs.getState).toHaveBeenCalledWith(expect.any(String));
    });

    it("should return 404 if the settings file doesn't exist", async () => {
      jest.mocked(Fs.getState).mockResolvedValueOnce(undefined);

      const response = await request.get(route);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Not Found" });
      expect(Fs.getState).toHaveBeenCalledTimes(1);
      expect(Fs.getState).toHaveBeenCalledWith(expect.any(String));
    });

    it("should return 500 if Fs.getState throws an error", async () => {
      jest.mocked(Fs.getState).mockRejectedValueOnce(new Error("err"));

      const response = await request.get(route);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Internal Server Error" });
      expect(Fs.getState).toHaveBeenCalledTimes(1);
      expect(Fs.getState).toHaveBeenCalledWith(expect.any(String));
    });
  });

  describe(`PUT ${route}`, () => {
    it("should return 200 and the settings", async () => {
      const response = await request.put(route).send(settingsPayloadFixture);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(settingsFixture);
      expect(Fs.setState).toHaveBeenCalledTimes(1);
      expect(Fs.setState).toHaveBeenCalledWith(expect.any(String), settingsFixture);
    });

    it("should return 500 if Fs.setState throws an error", async () => {
      jest.mocked(Fs.setState).mockRejectedValueOnce(new Error("err"));

      const response = await request.put(route).send(settingsPayloadFixture);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Internal Server Error" });
      expect(Fs.setState).toHaveBeenCalledTimes(1);
      expect(Fs.setState).toHaveBeenCalledWith(expect.any(String), settingsFixture);
    });
  });
});
