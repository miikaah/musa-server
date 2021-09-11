import { sep } from "path";
import { getAudiosWithFields, insertAudio, upsertAudio, upsertAlbum } from "./db";
import { audioExts } from "./fs";
import UrlSafeBase64 from "./urlsafe-base64";
import { AlbumCollection } from "./media-separator";

type Params = { files: string[]; albumCollection: AlbumCollection };

const defaultPayload: Params = { files: [], albumCollection: {} };

process.on("message", async (m: Params = defaultPayload) => {
  const { files, albumCollection } = m;

  if (!files || !Array.isArray(files)) {
    console.error("Did not get files JSON");
    process.exit(1);
  }

  const start = Date.now();
  const audios = await getAudiosWithFields(["path_id"]);
  const audioIdsInDb = audios.map((a) => a.path_id);
  const cleanFiles = files.filter((file) =>
    audioExts.some((ext) => file.toLowerCase().endsWith(ext))
  );
  const filesWithIds = cleanFiles.map((file) => ({
    id: UrlSafeBase64.encode(file),
    filename: file.split(sep).pop() || "",
  }));
  const albumEntries = Object.entries(albumCollection);

  const filesToInsert = [];
  const filesToUpdate = [];

  for (const file of filesWithIds) {
    if (audioIdsInDb.includes(file.id)) {
      filesToUpdate.push(file);
    } else {
      filesToInsert.push(file);
    }
  }

  console.log("Scanning file system audio files");
  console.log("----------------------");
  console.log(`Audios to insert: ${filesToInsert.length}`);
  console.log(`Audios to update: ${filesToUpdate.length}`);
  console.log(`Albums to update: ${albumEntries.length}`);
  console.log("----------------------");

  const startInsert = Date.now();
  for (const file of filesToInsert) {
    try {
      await insertAudio(file);
    } catch (err) {
      console.error(err);
    }
  }
  const timeForInsertSec = (Date.now() - startInsert) / 1000;
  const insertsPerSecond =
    timeForInsertSec > 0 ? Math.floor(filesToInsert.length / timeForInsertSec) : 0;
  console.log("\nScanner Report");
  console.log("----------------------");
  console.log(`Audio inserts took: ${timeForInsertSec} seconds`);
  console.log(`${insertsPerSecond} inserts per seconds\n`);

  const startUpdate = Date.now();
  for (const file of filesToUpdate) {
    try {
      await upsertAudio({
        ...file,
        quiet: true,
      });
    } catch (err) {
      console.error(err);
    }
  }
  const timeForUpdateSec = (Date.now() - startUpdate) / 1000;
  const updatesPerSecond =
    timeForUpdateSec > 0 ? Math.floor(filesToUpdate.length / timeForUpdateSec) : 0;
  console.log(`Audio updates took: ${timeForUpdateSec} seconds`);
  console.log(`${updatesPerSecond} updates per seconds\n`);

  const startAlbumUpdate = Date.now();
  for (const [id, album] of albumEntries) {
    await upsertAlbum({ id, album });
  }
  const timeForAlbumUpdateSec = (Date.now() - startAlbumUpdate) / 1000;
  const albumUpdatesPerSecond =
    timeForUpdateSec > 0 ? Math.floor(albumEntries.length / timeForAlbumUpdateSec) : 0;
  const totalTime = (Date.now() - start) / 1000;

  console.log(`Album updates took: ${timeForAlbumUpdateSec} seconds`);
  console.log(`${albumUpdatesPerSecond} updates per seconds\n`);
  console.log(`Total time: ${totalTime} seconds`);
  console.log("----------------------\n");
});
