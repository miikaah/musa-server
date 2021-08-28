import { app } from "./api";
import supertest from "supertest";

const request = supertest(app);

describe("API", () => {
  describe("GET /hello", () => {
    it("should get Hello", async () => {
      const response = await request.get("/hello").expect(200);

      expect(response.text).toBe("Hello");
    });

    it("should get 404 from non-existant route", async () => {
      await request.get("/not-exists").expect(404);
    });
  });
});
