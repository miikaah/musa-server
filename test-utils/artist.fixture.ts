import { Artist, ArtistObject, ArtistWithEnrichedAlbums } from "@miikaah/musa-core";

export const artistFixture: Artist = {
  url: "http://100.79.27.108:4200/artist/QXQgVGhlIEdhdGVz",
  name: "At The Gates",
  albums: [
    {
      id: "QXQgVGhlIEdhdGVzXEF0IFdhciBXaXRoIFJlYWxpdHk",
      name: "At War With Reality",
      url: "http://100.79.27.108:4200/album/QXQgVGhlIEdhdGVzXEF0IFdhciBXaXRoIFJlYWxpdHk",
      coverUrl:
        "http://100.79.27.108:4200/file/QXQgVGhlIEdhdGVzXEF0IFdhciBXaXRoIFJlYWxpdHlcQXQgV2FyIFdpdGggUmVhbGl0eS5qcGc",
      year: 2014,
    },
  ],
  files: [],
  images: [],
};

export const artistsFixture: ArtistObject = {
  A: [
    {
      id: "QWd1c3RpbiBCYXJyaW9zIE1hbmdvcmU",
      name: "Agustin Barrios Mangore",
      url: "http://100.79.27.108:4200/artist/QWd1c3RpbiBCYXJyaW9zIE1hbmdvcmU",
    },
  ],
};

export const artistAlbumsFixture: ArtistWithEnrichedAlbums = {
  url: "http://100.79.27.108:4200/artist/QW5keSBNY2tlZQ",
  name: "Andy Mckee",
  albums: [
    {
      id: "QW5keSBNY2tlZVxBbmR5IE1jS2VlIC0gQXJ0IG9mIE1vdGlvbiAtIDIwMDU",
      name: "Art of Motion",
      url: "http://100.79.27.108:4200/album/QW5keSBNY2tlZVxBbmR5IE1jS2VlIC0gQXJ0IG9mIE1vdGlvbiAtIDIwMDU",
      coverUrl:
        "http://100.79.27.108:4200/file/QW5keSBNY2tlZVxBbmR5IE1jS2VlIC0gQXJ0IG9mIE1vdGlvbiAtIDIwMDVcQXJ0IG9mIE1vdGlvbi5qcGc",
      year: 2005,
      files: [
        {
          id: "QW5keSBNY2tlZVxBbmR5IE1jS2VlIC0gQXJ0IG9mIE1vdGlvbiAtIDIwMDVcQW5keSBNY0tlZSAtIEFydCBvZiBNb3Rpb24gLSAwMSAtIEFydCBPZiBNb3Rpb24ubXAz",
          name: "Art Of Motion",
          track: "01",
          url: "http://100.79.27.108:4200/audio/QW5keSBNY2tlZVxBbmR5IE1jS2VlIC0gQXJ0IG9mIE1vdGlvbiAtIDIwMDVcQW5keSBNY0tlZSAtIEFydCBvZiBNb3Rpb24gLSAwMSAtIEFydCBPZiBNb3Rpb24ubXAz",
          fileUrl:
            "http://100.79.27.108:4200/file/QW5keSBNY2tlZVxBbmR5IE1jS2VlIC0gQXJ0IG9mIE1vdGlvbiAtIDIwMDVcQW5keSBNY0tlZSAtIEFydCBvZiBNb3Rpb24gLSAwMSAtIEFydCBPZiBNb3Rpb24ubXAz",
          metadata: {
            track: {
              no: 1,
              of: null,
            },
            disk: {
              no: null,
              of: null,
            },
            album: "Art of Motion",
            year: 2005,
            replayGainTrackGain: {
              dB: -7.25,
              ratio: 0.18836490894898006,
            },
            replayGainTrackPeak: {
              dB: 0.6465038398717338,
              ratio: 1.160514,
            },
            replayGainAlbumGain: {
              dB: -7.16,
              ratio: 0.19230917289101584,
            },
            replayGainAlbumPeak: {
              dB: 1.033541474362848,
              ratio: 1.268686,
            },
            title: "Art Of Motion",
            artists: ["Andy McKee"],
            artist: "Andy McKee",
            genre: ["Instrumental"],
            composer: ["Andy McKee"],
            albumArtist: "Andy McKee",
            comment: ["http://www.candyrat.com"],
            bitrate: 227379.0705983232,
            duration: 205.63591836734693,
            sampleRate: 44100,
            dynamicRange: "8",
            dynamicRangeAlbum: "8",
          },
        },
      ],
    },
  ],
  files: [],
  images: [],
};
