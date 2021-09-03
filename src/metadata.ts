import * as musicMetadata from "music-metadata";

export const readMetadata = async (
  filepath: string
): Promise<
  | musicMetadata.IAudioMetadata
  | { native: { "ID3v2.3": { id: string; value: string }[] }; common: { [x: string]: unknown } }
> => {
  let metadata = { native: { "ID3v2.3": [] }, common: {} };

  try {
    // @ts-expect-error wrongly typed in music-metadata
    metadata = await musicMetadata.parseFile(filepath);
  } catch (error) {
    console.error("Error when reading music metadata", error);
  }

  return metadata;
};
