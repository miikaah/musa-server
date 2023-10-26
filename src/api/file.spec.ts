import path from "path";
import supertest from "supertest";
import { UrlSafeBase64 } from "../musa-core-import";

import { app } from "../";

const request = supertest(app);

describe("File API tests", () => {
  const route = "/files";

  describe(`GET ${route}/:name`, () => {
    it("should return 200 and the file", async () => {
      const response = await request.get(
        `${route}/${UrlSafeBase64.encode(path.join("fixtures", "txt.txt"))}`,
      );

      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toBe("text/plain; charset=utf-8");
      expect(response.text).toMatchInlineSnapshot(`
        "text
        "
      `);
    });

    it("should return 404 if file doesn't exist", async () => {
      const response = await request.get(`${route}/${UrlSafeBase64.encode("foo")}`);

      expect(response.status).toBe(404);
    });
  });
});
