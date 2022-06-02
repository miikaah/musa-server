import supertest from "supertest";
import { Api } from "musa-core";
import { app } from "../";
import { themeFixture, themePayloadFixture } from "../../test-utils/theme.fixture";

jest.mock("musa-core");

(Api.getTheme as jest.MockedFunction<typeof Api.getTheme>).mockResolvedValue(themeFixture);
(Api.insertTheme as jest.MockedFunction<typeof Api.insertTheme>).mockResolvedValue(themeFixture);
(Api.getAllThemes as jest.MockedFunction<typeof Api.getAllThemes>).mockResolvedValue([
  themeFixture,
]);

const request = supertest(app);

describe("Theme API tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /theme", () => {
    const id = "foo";
    const route = `/theme/${id}`;

    it("should return 200 and the theme", async () => {
      const response = await request.get(route).expect(200);

      expect(response.body).toEqual(themeFixture);
      expect(Api.getTheme).toHaveBeenCalledTimes(1);
      expect(Api.getTheme).toHaveBeenCalledWith(id);
    });

    it("should return 404 if theme doesn't exist", async () => {
      (Api.getTheme as jest.MockedFunction<typeof Api.getTheme>).mockResolvedValueOnce(
        <any>undefined
      );

      const response = await request.get(route).expect(404);

      expect(response.body).toEqual({ message: "Not Found" });
      expect(Api.getTheme).toHaveBeenCalledTimes(1);
      expect(Api.getTheme).toHaveBeenCalledWith(id);
    });

    it("should return 500 if getTheme throws an error", async () => {
      (Api.getTheme as jest.MockedFunction<typeof Api.getTheme>).mockImplementationOnce(() => {
        throw new Error("err");
      });

      const response = await request.get(route).expect(500);

      expect(response.body).toEqual({ message: "Internal Server Error" });
      expect(Api.getTheme).toHaveBeenCalledTimes(1);
      expect(Api.getTheme).toHaveBeenCalledWith(id);
    });
  });

  describe("GET /themes", () => {
    const route = `/themes`;

    it("should return 200 and the themes", async () => {
      const response = await request.get(route).expect(200);

      expect(response.body).toEqual([themeFixture]);
      expect(Api.getAllThemes).toHaveBeenCalledTimes(1);
    });

    it("should return 500 if getAllThemes throws an error", async () => {
      (Api.getAllThemes as jest.MockedFunction<typeof Api.getAllThemes>).mockImplementationOnce(
        () => {
          throw new Error("err");
        }
      );

      const response = await request.get(route).expect(500);

      expect(response.body).toEqual({ message: "Internal Server Error" });
      expect(Api.getAllThemes).toHaveBeenCalledTimes(1);
    });
  });

  describe("PUT /theme/:id", () => {
    const id = "foo";
    const route = `/theme/${id}`;

    it("should return 201 and the theme", async () => {
      const response = await request.put(route).send(themePayloadFixture).expect(201);

      expect(response.body).toEqual(themeFixture);
      expect(Api.insertTheme).toHaveBeenCalledTimes(1);
      expect(Api.insertTheme).toHaveBeenCalledWith(id, themePayloadFixture.colors);
    });

    it("should return 500 if insertTheme throws an error", async () => {
      (Api.insertTheme as jest.MockedFunction<typeof Api.insertTheme>).mockImplementationOnce(
        () => {
          throw new Error("err");
        }
      );

      const response = await request.put(route).send(themePayloadFixture).expect(500);

      expect(response.body).toEqual({ message: "Internal Server Error" });
      expect(Api.insertTheme).toHaveBeenCalledTimes(1);
      expect(Api.insertTheme).toHaveBeenCalledWith(id, themePayloadFixture.colors);
    });
  });

  describe("DELETE /theme/:id", () => {
    const id = "foo";
    const route = `/theme/${id}`;

    it("should return 201 and the theme", async () => {
      const response = await request.delete(route).expect(204);

      expect(response.body).toEqual({});
      expect(Api.removeTheme).toHaveBeenCalledTimes(1);
      expect(Api.removeTheme).toHaveBeenCalledWith(id);
    });

    it("should return 500 if removeTheme throws an error", async () => {
      (Api.removeTheme as jest.MockedFunction<typeof Api.removeTheme>).mockImplementationOnce(
        () => {
          throw new Error("err");
        }
      );

      const response = await request.delete(route).expect(500);

      expect(response.body).toEqual({ message: "Internal Server Error" });
      expect(Api.removeTheme).toHaveBeenCalledTimes(1);
      expect(Api.removeTheme).toHaveBeenCalledWith(id);
    });
  });
});
