import { imageFixture } from "../test-utils/image.fixture";
import { FileCollection } from "./musa-core-import";

const { NODE_ENV } = process.env;

let imageCollection: FileCollection = {};

export const getImageCollection = (ignoreForTest = false): FileCollection => {
  return NODE_ENV === "test" && !ignoreForTest ? { foo: imageFixture } : imageCollection;
};

export const setImageCollection = (collection: FileCollection) => {
  imageCollection = collection;
};
