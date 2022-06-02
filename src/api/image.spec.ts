import supertest from "supertest";

import * as index from "../";
import { imageFixture } from "../../test-utils/image.fixture";

// @ts-expect-error it ain't read-only silly
index.imageCollection = { foo: imageFixture };

const request = supertest(index.app);

describe("Image API tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /image/:id", () => {
    const id = "foo";
    const route = `/image/${id}`;

    it("should return 200 and the image", async () => {
      const response = await request.get(route).expect(200);

      expect(response.body).toEqual(imageFixture);
    });

    it("should return 404 if the image doesn't exist", async () => {
      const response = await request.get("/image/bar").expect(404);

      expect(response.body).toEqual({ message: "Not Found" });
    });
  });
});
