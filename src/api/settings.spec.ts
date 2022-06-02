import supertest from "supertest";

import { setState, getState } from "../fs.state";
import { app } from "../";
import { settingsFixture, settingsPayloadFixture } from "../../test-utils/settings.fixture";

jest.mock("../fs.state");

(getState as jest.MockedFunction<typeof getState>).mockResolvedValue(settingsFixture);

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
      expect(getState).toHaveBeenCalledTimes(1);
    });

    it("should return 404 if the settings file doesn't exist", async () => {
      (getState as jest.MockedFunction<typeof getState>).mockResolvedValueOnce(undefined);

      const response = await request.get(route).expect(404);

      expect(response.body).toEqual({ message: "Not Found" });
      expect(getState).toHaveBeenCalledTimes(1);
    });

    it("should return 500 if getState throws an error", async () => {
      (getState as jest.MockedFunction<typeof getState>).mockImplementationOnce(() => {
        throw new Error("err");
      });

      const response = await request.get(route).expect(500);

      expect(response.body).toEqual({ message: "Internal Server Error" });
      expect(getState).toHaveBeenCalledTimes(1);
    });
  });

  describe("PUT /state", () => {
    const route = `/state`;

    it("should return 200 and the state", async () => {
      const response = await request.put(route).send(settingsPayloadFixture).expect(200);

      expect(response.body).toEqual(settingsFixture);
      expect(setState).toHaveBeenCalledTimes(1);
      expect(setState).toHaveBeenCalledWith(settingsFixture);
    });

    it("should return 500 if setState throws an error", async () => {
      (setState as jest.MockedFunction<typeof setState>).mockImplementationOnce(() => {
        throw new Error("err");
      });

      const response = await request.put(route).send(settingsPayloadFixture).expect(500);

      expect(response.body).toEqual({ message: "Internal Server Error" });
      expect(setState).toHaveBeenCalledTimes(1);
      expect(setState).toHaveBeenCalledWith(settingsFixture);
    });
  });
});
