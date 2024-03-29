import supertest from "supertest";
import { Api } from "../musa-core-import";

import { app } from "../";
import { themeFixture, themePayloadFixture } from "../../test-utils/theme.fixture";

vi.mock("../musa-core-import");
vi.mocked(Api.getTheme).mockResolvedValue(themeFixture);
vi.mocked(Api.insertTheme).mockResolvedValue(themeFixture);
vi.mocked(Api.updateTheme).mockResolvedValue(themeFixture);
vi.mocked(Api.getAllThemes).mockResolvedValue([themeFixture]);

const request = supertest(app);

describe("Theme API tests", () => {
  describe("GET /themes/:id", () => {
    const id = "foo";
    const route = `/themes/${id}`;

    it("should return 200 and the theme", async () => {
      const response = await request.get(route);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(themeFixture);
      expect(Api.getTheme).toHaveBeenCalledTimes(1);
      expect(Api.getTheme).toHaveBeenCalledWith(id);
    });

    it("should return 404 if getTheme throws an error", async () => {
      vi.mocked(Api.getTheme).mockRejectedValueOnce(new Error("err"));

      const response = await request.get(route);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Not Found" });
      expect(Api.getTheme).toHaveBeenCalledTimes(1);
      expect(Api.getTheme).toHaveBeenCalledWith(id);
    });
  });

  describe("GET /themes", () => {
    const route = `/themes`;

    it("should return 200 and the themes", async () => {
      const response = await request.get(route);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([themeFixture]);
      expect(Api.getAllThemes).toHaveBeenCalledTimes(1);
    });

    it("should return 500 if getAllThemes throws an error", async () => {
      vi.mocked(Api.getAllThemes).mockRejectedValueOnce(new Error("err"));

      const response = await request.get(route);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Internal Server Error" });
      expect(Api.getAllThemes).toHaveBeenCalledTimes(1);
    });
  });

  describe("PUT /themes/:id", () => {
    const id = "foo";
    const route = `/themes/${id}`;

    it("should return 201 and the theme", async () => {
      const response = await request.put(route).send(themePayloadFixture);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(themeFixture);
      expect(Api.insertTheme).toHaveBeenCalledTimes(1);
      expect(Api.insertTheme).toHaveBeenCalledWith(id, themePayloadFixture.colors);
    });

    it("should return 500 if insertTheme throws an error", async () => {
      vi.mocked(Api.insertTheme).mockRejectedValueOnce(new Error("err"));

      const response = await request.put(route).send(themePayloadFixture);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Internal Server Error" });
      expect(Api.insertTheme).toHaveBeenCalledTimes(1);
      expect(Api.insertTheme).toHaveBeenCalledWith(id, themePayloadFixture.colors);
    });
  });

  describe("PATCH /themes/:id", () => {
    const id = "foo";
    const route = `/themes/${id}`;

    it("should return 200 and the theme", async () => {
      const response = await request.patch(route).send(themePayloadFixture);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(themeFixture);
      expect(Api.updateTheme).toHaveBeenCalledTimes(1);
      expect(Api.updateTheme).toHaveBeenCalledWith(id, themePayloadFixture.colors);
    });

    it("should return 500 if updateTheme throws an error", async () => {
      vi.mocked(Api.updateTheme).mockRejectedValueOnce(new Error("err"));

      const response = await request.patch(route).send(themePayloadFixture);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Internal Server Error" });
      expect(Api.updateTheme).toHaveBeenCalledTimes(1);
      expect(Api.updateTheme).toHaveBeenCalledWith(id, themePayloadFixture.colors);
    });
  });

  describe("DELETE /themes/:id", () => {
    const id = "foo";
    const route = `/themes/${id}`;

    it("should return 201 and the theme", async () => {
      const response = await request.delete(route);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
      expect(Api.removeTheme).toHaveBeenCalledTimes(1);
      expect(Api.removeTheme).toHaveBeenCalledWith(id);
    });

    it("should return 500 if removeTheme throws an error", async () => {
      vi.mocked(Api.removeTheme).mockRejectedValueOnce(new Error("err"));

      const response = await request.delete(route);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Internal Server Error" });
      expect(Api.removeTheme).toHaveBeenCalledTimes(1);
      expect(Api.removeTheme).toHaveBeenCalledWith(id);
    });
  });
});
