import { getImageCollection, setImageCollection } from "./repo";
import { imageFixture } from "../test-utils/image.fixture";

describe("Repo tests", () => {
  it("should set and get imageCollection", () => {
    expect(getImageCollection()).toEqual({
      foo: imageFixture,
    });

    setImageCollection({});

    expect(getImageCollection(true)).toEqual({});
  });
});
