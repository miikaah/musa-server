import supertest from "supertest";
import { Api } from "musa-core";
import { app } from "../";
import { findQueryFixture, emptyFindResultFixture } from "../../test-utils/find.fixture";

jest.mock("musa-core");

(Api.find as jest.MockedFunction<typeof Api.find>).mockResolvedValue(findQueryFixture);
(Api.findRandom as jest.MockedFunction<typeof Api.findRandom>).mockResolvedValue(findQueryFixture);

const request = supertest(app);

describe("Find API tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /find/:query", () => {
    const query = "foo";
    const route = `/find/${query}`;

    it("should get 200 and the results", async () => {
      const response = await request.get(route).expect(200);

      expect(response.body).toEqual(findQueryFixture);
      expect(Api.find).toHaveBeenCalledTimes(1);
      expect(Api.find).toHaveBeenCalledWith({ query });
    });

    it("should get 200 and a default empty result set", async () => {
      (Api.find as jest.MockedFunction<typeof Api.find>).mockResolvedValueOnce(
        <any>emptyFindResultFixture
      );

      const response = await request.get(route).expect(200);

      expect(response.body).toEqual(emptyFindResultFixture);
      expect(Api.find).toHaveBeenCalledTimes(1);
      expect(Api.find).toHaveBeenCalledWith({ query });
    });
  });

  describe("GET /find-random", () => {
    const route = "/find-random";

    it("should get 200 and the results", async () => {
      const response = await request.get(route).expect(200);

      expect(response.body).toEqual(findQueryFixture);
      expect(Api.findRandom).toHaveBeenCalledTimes(1);
    });
  });
});
