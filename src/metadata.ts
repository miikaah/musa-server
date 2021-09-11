import * as musicMetadata from "music-metadata";
import path from "path";
import UrlSafeBase64 from "./urlsafe-base64";

const { MUSA_SRC_PATH = "" } = process.env;

type FormatMetadata = {
  bitrate: number;
  duration: number;
  sampleRate: number;
};

type CommonMetadata = {
  track: NumberOf;
  disk: NumberOf;
  album: string;
  year: number;
  date: string;
  replaygain_track_gain: ReplayGain;
  replaygain_track_peak: ReplayGain;
  replaygain_album_gain: ReplayGain;
  replaygain_album_peak: ReplayGain;
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
  format: Partial<FormatMetadata>;
  native: {
    ID3v1?: { id: string; value: string }[];
    "ID3v2.3"?: { id: string; value: string }[];
    "ID3v2.4"?: { id: string; value: string }[];
    vorbis?: { id: string; value: string }[];
  };
  common: Partial<CommonMetadata>;
};

export const readMetadata = async (filepath: string): Promise<AudioMetadata> => {
  let metadata = { format: {}, native: { "ID3v2.3": [] }, common: {} };

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
  replayGainAlbumGain: ReplayGain;
  replayGainAlbumPeak: ReplayGain;
  title: string;
  artists: string[];
  artist: string;
  encoderSettings: string;
  composer: string;
  albumArtist: string;
  genre: string[];
  dynamicRange: string;
  dynamicRangeAlbum: string;
  bitrate: number;
  duration: number;
  sampleRate: number;
}>;

type NumberOf = { no: string | null; of: string | null };
type ReplayGain = { dB: number; ratio: number };

type GetMetadataParams = {
  id: string;
  quiet?: boolean;
};

export const getMetadata = async ({ id, quiet = false }: GetMetadataParams): Promise<Metadata> => {
  const audioPath = path.join(MUSA_SRC_PATH, UrlSafeBase64.decode(id));
  const { format, native, common } = await readMetadata(audioPath);
  const id3v2x = native["ID3v2.4"] || native["ID3v2.3"] || native["ID3v1"] || [];
  const { vorbis = [] } = native;

  let dynamicRangeTags = {};
  if (id3v2x.length) {
    // mp3
    dynamicRangeTags = {
      dynamicRange: (id3v2x.find((tag) => tag.id === "TXXX:DYNAMIC RANGE") || {}).value,
      dynamicRangeAlbum: (id3v2x.find((tag) => tag.id === "TXXX:ALBUM DYNAMIC RANGE") || {}).value,
    };
  } else if (vorbis.length) {
    // flac
    dynamicRangeTags = {
      dynamicRange: (vorbis.find((tag) => tag.id === "DYNAMIC RANGE") || {}).value,
      dynamicRangeAlbum: (vorbis.find((tag) => tag.id === "ALBUM DYNAMIC RANGE") || {}).value,
    };
  }

  if (!quiet) {
    console.log("format", format);
    console.log("native", native);
    console.log("common", common);
  }

  const {
    track,
    disk,
    album,
    year,
    date,
    replaygain_track_gain: replayGainTrackGain,
    replaygain_track_peak: replayGainTrackPeak,
    replaygain_album_gain: replayGainAlbumGain,
    replaygain_album_peak: replayGainAlbumPeak,
    title,
    artists,
    artist,
    encodersettings: encoderSettings,
    genre,
    composer,
    albumartist: albumArtist,
    comment,
  } = common;
  const { bitrate, duration, sampleRate } = format;

  const metadata = {
    track,
    disk,
    album,
    year,
    date,
    replayGainTrackGain,
    replayGainTrackPeak,
    replayGainAlbumGain,
    replayGainAlbumPeak,
    title,
    artists,
    artist,
    encoderSettings,
    genre,
    composer,
    albumArtist,
    comment,
    bitrate,
    duration,
    sampleRate,
    ...dynamicRangeTags,
  };

  return metadata;
};
