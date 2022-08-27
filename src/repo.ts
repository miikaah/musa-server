import { FileCollection } from "./musa-core-import";
import { imageFixture } from "../test-utils/image.fixture";

const { NODE_ENV } = process.env;

let imageCollection: FileCollection = {};

export const getImageCollection = (ignoreForTest = false): FileCollection => {
  return NODE_ENV === "test" && !ignoreForTest ? { foo: imageFixture } : imageCollection;
};

export const setImageCollection = (collection: FileCollection) => {
  imageCollection = collection;
};
