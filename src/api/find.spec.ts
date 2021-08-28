import { app } from "../api";
import supertest from "supertest";

const request = supertest(app);

const mockFuzzySort = jest.fn().mockImplementation(() => {
  const results = [
    {
      target: "bar",
    },
  ];
  // @ts-expect-error dont know how to type this
  results.total = results.length;

  return results;
});
jest.mock("fuzzysort", () => {
  return {
    go: () => mockFuzzySort(),
  };
});

describe("API", () => {
  const route = "/find/files";

  describe(`GET ${route}/:name`, () => {
    it("should get 200 and empty results if no results", async () => {
      mockFuzzySort.mockReturnValueOnce([]);

      const response = await request.get(`${route}/foo}`).expect(200);

      expect(response.body).toEqual({ limit: 50, results: [], total: 0 });
    });

    it("should get 200 and results", async () => {
      const response = await request.get(`${route}/bar}`).expect(200);

      expect(response.body).toEqual({
        limit: 50,
        results: [
          {
            path: "bar",
            url: "http://localhost:4200/file/YmFy",
          },
        ],
        total: 1,
      });
    });
  });
});
