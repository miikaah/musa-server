import { imageFixture } from "../test-utils/image.fixture";
import { getImageCollection, setImageCollection } from "./repo";

describe("Repo tests", () => {
  it("should set and get imageCollection", () => {
    expect(getImageCollection()).toEqual({
      foo: imageFixture,
    });

    setImageCollection({});

    expect(getImageCollection(true)).toEqual({});
  });
});
