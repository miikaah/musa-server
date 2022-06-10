import { AlbumWithFilesAndMetadata } from "musa-core";

export const albumFixture: AlbumWithFilesAndMetadata = {
  name: "At War With Reality",
  artistName: "At The Gates",
  artistUrl: "http://100.79.27.108:4200/artist/QXQgVGhlIEdhdGVz",
  files: [
    {
      id: "QXQgVGhlIEdhdGVzXEF0IFdhciBXaXRoIFJlYWxpdHlcQXQgVGhlIEdhdGVzIC0gRGVhdGggQW5kIFRoZSBMYWJ5cmludGgubXAz",
      name: "Death And The Labyrinth",
      track: "1.02",
      url: "http://100.79.27.108:4200/audio/QXQgVGhlIEdhdGVzXEF0IFdhciBXaXRoIFJlYWxpdHlcQXQgVGhlIEdhdGVzIC0gRGVhdGggQW5kIFRoZSBMYWJ5cmludGgubXAz",
      fileUrl:
        "http://100.79.27.108:4200/file/QXQgVGhlIEdhdGVzXEF0IFdhciBXaXRoIFJlYWxpdHlcQXQgVGhlIEdhdGVzIC0gRGVhdGggQW5kIFRoZSBMYWJ5cmludGgubXAz",
      metadata: {
        track: {
          no: "2",
          of: "13",
        },
        disk: {
          no: "1",
          of: "1",
        },
        album: "At War With Reality",
        year: 2014,
        replayGainTrackGain: {
          dB: -11.12,
          ratio: 0.07726805850957025,
        },
        replayGainTrackPeak: {
          dB: 0.24813932629310592,
          ratio: 1.0588,
        },
        replayGainAlbumGain: {
          dB: -10.76,
          ratio: 0.08394599865193973,
        },
        replayGainAlbumPeak: {
          dB: 0.5190580400858634,
          ratio: 1.126953,
        },
        title: "Death And The Labyrinth",
        artists: ["At The Gates"],
        artist: "At The Gates",
        genre: ["Metal"],
        albumArtist: "At The Gates",
        comment: ["Purchased from 7digital.com"],
        bitrate: 320000,
        duration: 153.05142857142857,
        sampleRate: 44100,
        dynamicRange: "6",
        dynamicRangeAlbum: "6",
      },
    },
  ],
  images: [
    {
      id: "QXQgVGhlIEdhdGVzXEF0IFdhciBXaXRoIFJlYWxpdHlcQXQgV2FyIFdpdGggUmVhbGl0eS5qcGc",
      name: "At War With Reality.jpg",
      url: "http://100.79.27.108:4200/image/QXQgVGhlIEdhdGVzXEF0IFdhciBXaXRoIFJlYWxpdHlcQXQgV2FyIFdpdGggUmVhbGl0eS5qcGc",
      fileUrl:
        "http://100.79.27.108:4200/file/QXQgVGhlIEdhdGVzXEF0IFdhciBXaXRoIFJlYWxpdHlcQXQgV2FyIFdpdGggUmVhbGl0eS5qcGc",
    },
  ],
  coverUrl:
    "http://100.79.27.108:4200/file/QXQgVGhlIEdhdGVzXEF0IFdhciBXaXRoIFJlYWxpdHlcQXQgV2FyIFdpdGggUmVhbGl0eS5qcGc",
  id: "QXQgVGhlIEdhdGVzXEF0IFdhciBXaXRoIFJlYWxpdHk",
  metadata: {
    year: 2014,
    album: "At War With Reality",
    artists: ["At The Gates"],
    artist: "At The Gates",
    albumArtist: "At The Gates",
    genre: ["Metal"],
    dynamicRangeAlbum: "6",
  },
};
