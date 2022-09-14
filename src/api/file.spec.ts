import supertest from "supertest";
import { UrlSafeBase64 } from "@miikaah/musa-core";
import path from "path";

import { app } from "../";

const request = supertest(app);

describe("File API tests", () => {
  const route = "/files";

  describe(`GET ${route}/:name`, () => {
    it("should return 200 and the file", async () => {
      const response = await request
        .get(`${route}/${UrlSafeBase64.encode(path.join("fixtures", "txt.txt"))}`)
        .expect(200);

      expect(response.headers["content-type"]).toBe("text/plain; charset=utf-8");
      expect(response.text).toBe("text\n");
    });

    it("should return 404 if file doesn't exist", async () => {
      await request.get(`${route}/${UrlSafeBase64.encode("foo")}`).expect(404);
    });
  });
});
