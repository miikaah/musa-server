import { app } from ".";
import supertest from "supertest";

const request = supertest(app);

describe("API", () => {
  const notExistsRoute = "/not-exists";

  it(`should get 404 from ${notExistsRoute} route`, async () => {
    await request.get(notExistsRoute).expect(404);
  });
});
