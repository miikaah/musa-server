import { app } from "../api";
import supertest from "supertest";
import { UrlSafeBase64 } from "musa-core";
import path from "path";

const request = supertest(app);

describe("API", () => {
  const route = "/file";

  describe(`GET ${route}/:name`, () => {
    it("should get 404 if file doesn't exist", async () => {
      await request.get(`${route}/${UrlSafeBase64.encode("foo")}`).expect(404);
    });

    it("should get 200 and the file", async () => {
      const response = await request
        .get(`${route}/${UrlSafeBase64.encode(path.join("fixtures", "txt.txt"))}`)
        .expect(200);

      expect(response.headers["content-type"]).toBe("text/plain; charset=UTF-8");
      expect(response.text).toBe("text\n");
    });
  });
});
