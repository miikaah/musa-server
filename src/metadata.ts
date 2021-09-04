import * as musicMetadata from "music-metadata";
import path from "path";
import UrlSafeBase64 from "./urlsafe-base64";

const { MUSA_SRC_PATH = "" } = process.env;

type AudioMetadata = {
  native: { "ID3v2.3": { id: string; value: string }[] };
  common: { [x: string]: unknown };
};

export const readMetadata = async (
  filepath: string
): Promise<musicMetadata.IAudioMetadata | AudioMetadata> => {
  let metadata = { native: { "ID3v2.3": [] }, common: {} };

  try {
    // @ts-expect-error wrongly typed in music-metadata
    metadata = await musicMetadata.parseFile(filepath);
  } catch (error) {
    console.error("Error when reading music metadata", error);
  }

  return metadata;
};

export type Metadata = { [x: string]: unknown };

export const getMetadata = async (id: string): Promise<Metadata> => {
  const audioPath = path.join(MUSA_SRC_PATH, UrlSafeBase64.decode(id));
  const { native, common } = await readMetadata(audioPath);
  const id3v2point3 = native["ID3v2.3"] || [];
  const id3v2 = {
    dynamicRange: (id3v2point3.find((tag) => tag.id === "TXXX:DYNAMIC RANGE") || {}).value,
    dynamicRangeAlbum: (id3v2point3.find((tag) => tag.id === "TXXX:ALBUM DYNAMIC RANGE") || {})
      .value,
  };

  return {
    ...common,
    ...id3v2,
  };
};
