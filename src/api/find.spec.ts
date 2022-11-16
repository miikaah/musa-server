import supertest from "supertest";
import { Api } from "../musa-core-import";

import { app } from "../";
import { emptyFindResultFixture, findQueryFixture } from "../../test-utils/find.fixture";

jest.mock("../musa-core-import");
jest.mocked(Api.find).mockResolvedValue(findQueryFixture);
jest.mocked(Api.findRandom).mockResolvedValue(findQueryFixture);

const request = supertest(app);

describe("Find API tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /find/:query", () => {
    const query = "foo";
    const limit = 32;
    const route = `/find/${query}`;

    it("should return 200 and the results", async () => {
      const response = await request.get(route);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(findQueryFixture);
      expect(Api.find).toHaveBeenCalledTimes(1);
      expect(Api.find).toHaveBeenCalledWith({ query, limit });
    });

    it("should return 200 and a default empty result set", async () => {
      jest.mocked(Api.find).mockResolvedValueOnce(<any>emptyFindResultFixture);

      const response = await request.get(route);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(emptyFindResultFixture);
      expect(Api.find).toHaveBeenCalledTimes(1);
      expect(Api.find).toHaveBeenCalledWith({ query, limit });
    });

    it("should return 500 if find throws an error", async () => {
      jest.mocked(Api.find).mockRejectedValueOnce(new Error("err"));

      const response = await request.get(route);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Internal Server Error" });
      expect(Api.find).toHaveBeenCalledTimes(1);
      expect(Api.find).toHaveBeenCalledWith({ query, limit });
    });
  });

  describe("GET /find-random", () => {
    const route = "/find-random";

    it("should return 200 and the results", async () => {
      const response = await request.get(route);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(findQueryFixture);
      expect(Api.findRandom).toHaveBeenCalledTimes(1);
    });

    it("should return 500 if findRandom throws an error", async () => {
      jest.mocked(Api.findRandom).mockRejectedValueOnce(new Error("err"));

      const response = await request.get(route);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Internal Server Error" });
      expect(Api.findRandom).toHaveBeenCalledTimes(1);
    });
  });
});
