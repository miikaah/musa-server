import { sep } from "path";
import { getAudiosWithFields, insertAudio, upsertAudio } from "./db";
import { audioExts } from "./fs";
import UrlSafeBase64 from "./urlsafe-base64";

process.on("message", async (m: { files: string[] } = { files: [] }) => {
  const { files } = m;

  if (!files || !Array.isArray) {
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
  console.log(`Files to insert: ${filesToInsert.length}`);
  console.log(`Files to update: ${filesToUpdate.length}`);
  console.log("----------------------");

  const startInsert = Date.now();
  for (let i = 0; i < filesToInsert.length; i += 4) {
    try {
      // Make sure there's no overflow
      if (filesToInsert[i]) {
        await insertAudio(filesToInsert[i]);
      }
      // Start concurrent inserts to speed it up
      for (let j = 1; j < 4; j++) {
        if (filesToInsert[i + j]) {
          insertAudio(filesToInsert[i + j]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
  const timeForInsertSec = (Date.now() - startInsert) / 1000;
  const insertsPerSecond =
    timeForInsertSec > 0 ? Math.floor(filesToInsert.length / timeForInsertSec) : 0;

  const startUpdate = Date.now();
  for (let i = 0; i < filesToUpdate.length; i += 4) {
    try {
      // Make sure there's no overflow
      if (filesToUpdate[i]) {
        const { id, filename } = filesToUpdate[i];
        await upsertAudio({
          id,
          audio: { name: filename },
          quiet: true,
        });
      }
      // Start concurrent inserts to speed it up
      for (let j = 1; j < 4; j++) {
        if (filesToUpdate[i + j]) {
          const { id, filename } = filesToUpdate[i + j];
          upsertAudio({
            id,
            audio: { name: filename },
            quiet: true,
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
  const timeForUpdateSec = (Date.now() - startUpdate) / 1000;
  const updatesPerSecond =
    timeForUpdateSec > 0 ? Math.floor(filesToUpdate.length / timeForUpdateSec) : 0;
  const totalTime = (Date.now() - start) / 1000;

  console.log("\nScanner Report");
  console.log("----------------------");
  console.log(`Inserts took: ${timeForInsertSec} seconds`);
  console.log(`${insertsPerSecond} inserts per seconds\n`);
  console.log(`Updates took: ${timeForUpdateSec} seconds`);
  console.log(`${updatesPerSecond} updates per seconds\n`);
  console.log(`Total time: ${totalTime} seconds`);
  console.log("----------------------\n");
});
