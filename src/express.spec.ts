import supertest from "supertest";

import { app } from ".";

const request = supertest(app);

describe("API", () => {
  const notExistsRoute = "/not-exists";

  it(`should return 404 from ${notExistsRoute} route`, async () => {
    await request.get(notExistsRoute).expect(404);
  });
});
