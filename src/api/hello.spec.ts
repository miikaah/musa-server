import { app } from "../api";
import supertest from "supertest";

const request = supertest(app);

describe("API", () => {
  const route = "/hello";

  describe(`GET ${route}`, () => {
    it("should get Hello", async () => {
      const response = await request.get(route).expect(200);

      expect(response.text).toBe("Hello");
    });
  });
});
