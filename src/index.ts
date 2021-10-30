import { Db, Scanner, FileCollection } from "musa-core";
import { app } from "./api";

const { NODE_ENV, MUSA_SRC_PATH = "", PORT = 4200, MUSA_BASE_URL } = process.env;

const baseUrl = `${MUSA_BASE_URL}:${PORT}`;

export let imageCollection: FileCollection = {};

const start = async () => {
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
