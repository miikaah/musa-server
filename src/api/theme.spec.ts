import supertest from "supertest";
import { Api } from "musa-core";
import { app } from "../";
import { themeDbFixture, themeFixture, themePayloadFixture } from "../../test-utils/theme.fixture";

jest.mock("musa-core");

(Api.getTheme as jest.MockedFunction<typeof Api.getTheme>).mockResolvedValue(themeDbFixture);
(Api.insertTheme as jest.MockedFunction<typeof Api.insertTheme>).mockResolvedValue(themeDbFixture);
(Api.getAllThemes as jest.MockedFunction<typeof Api.getAllThemes>).mockResolvedValue([
  themeDbFixture,
]);

const request = supertest(app);

describe("Theme API tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /theme", () => {
    const id = "foo";
    const route = `/theme/${id}`;

    it("should get 200 and the theme", async () => {
      const response = await request.get(route).expect(200);

      expect(response.body).toEqual(themeFixture);
      expect(Api.getTheme).toHaveBeenCalledTimes(1);
      expect(Api.getTheme).toHaveBeenCalledWith(id);
    });

    it("should get 404 if theme doesn't exist", async () => {
      (Api.getTheme as jest.MockedFunction<typeof Api.getTheme>).mockResolvedValueOnce(
        <any>undefined
      );

      const response = await request.get(route).expect(404);

      expect(response.body).toEqual({ message: "Not Found" });
      expect(Api.getTheme).toHaveBeenCalledTimes(1);
      expect(Api.getTheme).toHaveBeenCalledWith(id);
    });
  });

  describe("GET /themes", () => {
    const route = `/themes`;

    it("should get 200 and the themes", async () => {
      const response = await request.get(route).expect(200);

      expect(response.body).toEqual([themeFixture]);
      expect(Api.getAllThemes).toHaveBeenCalledTimes(1);
    });
  });

  describe("PUT /theme/:id", () => {
    const id = "foo";
    const route = `/theme/${id}`;

    it("should get 201 and the theme", async () => {
      const response = await request.put(route).send(themePayloadFixture).expect(201);

      expect(response.body).toEqual(themeFixture);
      expect(Api.insertTheme).toHaveBeenCalledTimes(1);
      expect(Api.insertTheme).toHaveBeenCalledWith(id, themePayloadFixture.colors);
    });
  });

  describe("DELETE /theme/:id", () => {
    const id = "foo";
    const route = `/theme/${id}`;

    it("should get 201 and the theme", async () => {
      const response = await request.delete(route).expect(204);

      expect(response.body).toEqual({});
      expect(Api.removeTheme).toHaveBeenCalledTimes(1);
      expect(Api.removeTheme).toHaveBeenCalledWith(id);
    });
  });
});
