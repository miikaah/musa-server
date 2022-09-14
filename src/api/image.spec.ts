import supertest from "supertest";

import { app } from "../";
import { imageFixture } from "../../test-utils/image.fixture";

const request = supertest(app);

describe("Image API tests", () => {
  describe("GET /images/:id", () => {
    const id = "foo";
    const route = `/images/${id}`;

    it("should return 200 and the image", async () => {
      const response = await request.get(route);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(imageFixture);
    });

    it("should return 404 if the image doesn't exist", async () => {
      const response = await request.get("/images/bar");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Not Found" });
    });
  });
});
