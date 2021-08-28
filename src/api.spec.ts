import { app } from "./api";
import supertest from "supertest";

const request = supertest(app);

describe("API", () => {
  const route = "/not-exists";

  describe(`GET ${route}`, () => {
    it("should get 404 from non-existant route", async () => {
      await request.get(route).expect(404);
    });
  });
});
