import { Db, Scanner, FileCollection } from "@miikaah/musa-core";

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
const musicLibraryPath = MUSA_SRC_PATH;

export let imageCollection: FileCollection = {};

export const start = async () => {
  app.use(errorHandler);

  if (NODE_ENV === "test" && !process.env.FORCE_SERVER_START) {
    return;
  }

  await Db.init(musicLibraryPath);
  const mediaCollection = await Scanner.init({
    musicLibraryPath,
    baseUrl,
    isElectron: false,
  });
  imageCollection = mediaCollection.imageCollection || {};

  app.listen(PORT, async () => {
    if (NODE_ENV !== "test") {
      console.log(`Serving ${baseUrl}\n`);
    }

    Scanner.update({ musicLibraryPath });
  });
};

start();
