import UrlSafeBase64 from "./urlsafe-base64";

describe("UrlSafeBase64", () => {
  describe("encode", () => {
    it("should encode to base64", () => {
      expect(UrlSafeBase64.encode("foo")).toBe("Zm9v");
    });
  });

  describe("decode", () => {
    it("should decode from base64", () => {
      expect(UrlSafeBase64.decode("Zm9v")).toBe("foo");
    });
  });
});
