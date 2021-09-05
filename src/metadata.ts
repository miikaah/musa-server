import * as musicMetadata from "music-metadata";
import path from "path";
import UrlSafeBase64 from "./urlsafe-base64";

const { MUSA_SRC_PATH = "" } = process.env;

type CommonMetadata = {
  track: NumberOf;
  disk: NumberOf;
  album: string;
  year: number;
  date: string;
  replaygain_track_gain: ReplayGain;
  replaygain_track_peak: ReplayGain;
  title: string;
  artists: string[];
  artist: string;
  encodersettings: string;
  composer: string;
  comment: string;
  albumartist: string;
  genre: string[];
};

type AudioMetadata = {
  native: {
    "ID3v2.3"?: { id: string; value: string }[];
    "ID3v2.4"?: { id: string; value: string }[];
  };
  common: Partial<CommonMetadata>;
};

export const readMetadata = async (filepath: string): Promise<AudioMetadata> => {
  let metadata = { native: { "ID3v2.3": [] }, common: {} };

  try {
    // @ts-expect-error wrongly typed in music-metadata
    metadata = await musicMetadata.parseFile(filepath);
  } catch (error) {
    console.error("Error when reading music metadata", error);
  }

  return metadata;
};

export type Metadata = Partial<{
  track: NumberOf;
  disk: NumberOf;
  album: string;
  year: number;
  date: string;
  replayGainTrackGain: ReplayGain;
  replayGainTrackPeak: ReplayGain;
  title: string;
  artists: string[];
  artist: string;
  encoderSettings: string;
  composer: string;
  albumArtist: string;
  genre: string[];
  dynamicRange: string;
  dynamicRangeAlbum: string;
}>;

type NumberOf = { no: string | null; of: string | null };
type ReplayGain = { dB: number; ratio: number };

export const getMetadata = async (id: string): Promise<Metadata> => {
  const audioPath = path.join(MUSA_SRC_PATH, UrlSafeBase64.decode(id));
  const { native, common } = await readMetadata(audioPath);
  const id3v2point3 = native["ID3v2.4"] || native["ID3v2.3"] || [];
  const id3v2 = {
    dynamicRange: (id3v2point3.find((tag) => tag.id === "TXXX:DYNAMIC RANGE") || {}).value,
    dynamicRangeAlbum: (id3v2point3.find((tag) => tag.id === "TXXX:ALBUM DYNAMIC RANGE") || {})
      .value,
  };

  console.log(native);
  console.log(common);

  const {
    track,
    disk,
    album,
    year,
    date,
    replaygain_track_gain: replayGainTrackGain,
    replaygain_track_peak: replayGainTrackPeak,
    title,
    artists,
    artist,
    encodersettings: encoderSettings,
    genre,
    composer,
    albumartist: albumArtist,
    comment,
  } = common;

  const metadata = {
    track,
    disk,
    album,
    year,
    date,
    replayGainTrackGain,
    replayGainTrackPeak,
    title,
    artists,
    artist,
    encoderSettings,
    genre,
    composer,
    albumArtist,
    comment,
    ...id3v2,
  };

  return metadata;
};
