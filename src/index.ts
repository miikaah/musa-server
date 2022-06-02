import { Db, Scanner, FileCollection } from "musa-core";

import { app } from "./api";
import { errorHandler } from "./error-handler";

export { app } from "./api";
export * from "./api/find";
export * from "./api/file";
export * from "./api/artist";
export * from "./api/album";
export * from "./api/audio";
export * from "./api/image";
export * from "./api/settings";
export * from "./api/theme";
export * from "./api/static";

const { NODE_ENV, MUSA_SRC_PATH = "", PORT = 4200, MUSA_BASE_URL } = process.env;

const baseUrl = `${MUSA_BASE_URL}:${PORT}`;

export let imageCollection: FileCollection = {};

const start = async () => {
  app.use(errorHandler);

  if (NODE_ENV === "test") {
    return;
  }

  Db.init(MUSA_SRC_PATH);
  const mediaCollection = await Scanner.init({
    musicLibraryPath: MUSA_SRC_PATH,
    baseUrl,
    isElectron: false,
  });
  imageCollection = mediaCollection.imageCollection;

  app.listen(PORT, async () => {
    console.log(`Serving ${baseUrl}\n`);
    Scanner.update({});
  });
};

start();
