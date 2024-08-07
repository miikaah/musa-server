import { FindResult } from "@miikaah/musa-core";

export const findQueryFixture: FindResult = {
  artists: [],
  albums: [
    {
      name: "Alkuteos",
      artistName: "CMX",
      artistUrl: "http://100.79.27.108:4200/artist/Q01Y",
      files: [
        {
          id: "Q01YXEFsa3V0ZW9zXDAxIC0gRWxlbWVudGEubXAz",
          name: "Elementa",
          track: "01",
          url: "http://100.79.27.108:4200/audio/Q01YXEFsa3V0ZW9zXDAxIC0gRWxlbWVudGEubXAz",
          fileUrl:
            "http://100.79.27.108:4200/file/Q01YXEFsa3V0ZW9zXDAxIC0gRWxlbWVudGEubXAz",
          coverUrl: "",
          metadata: {
            track: {
              no: "1",
              of: "8",
            },
            disk: {
              no: null,
              of: null,
            },
            album: "Alkuteos",
            year: 2018,
            replayGainTrackGain: {
              dB: -7.13,
              ratio: 0.19364219639466074,
            },
            replayGainTrackPeak: {
              dB: 0.06279448087113502,
              ratio: 1.014564,
            },
            replayGainAlbumGain: {
              dB: -7.78,
              ratio: 0.16672472125510626,
            },
            replayGainAlbumPeak: {
              dB: 0.13248134251813326,
              ratio: 1.030975,
            },
            title: "Elementa",
            artists: ["CMX"],
            artist: "CMX",
            encoderSettings:
              "Audiograbber 1.83.01, LAME dll 3.99, 320 Kbit/s, Joint Stereo, Normal quality",
            genre: ["Acid Jazz"],
            bitrate: 320000,
            duration: 478.4587755102041,
            sampleRate: 44100,
            dynamicRange: "8",
            dynamicRangeAlbum: "8",
          },
        },
      ],
      images: [
        {
          id: "Q01YXEFsa3V0ZW9zXEFsa3V0ZW9zLmpwZw",
          name: "Alkuteos.jpg",
          url: "http://100.79.27.108:4200/image/Q01YXEFsa3V0ZW9zXEFsa3V0ZW9zLmpwZw",
          fileUrl: "http://100.79.27.108:4200/file/Q01YXEFsa3V0ZW9zXEFsa3V0ZW9zLmpwZw",
        },
      ],
      coverUrl: "http://100.79.27.108:4200/file/Q01YXEFsa3V0ZW9zXEFsa3V0ZW9zLmpwZw",
      id: "Q01YXEFsa3V0ZW9z",
      metadata: {
        year: 2018,
        album: "Alkuteos",
        artists: ["CMX"],
        artist: "CMX",
        genre: ["Acid Jazz"],
        dynamicRangeAlbum: "8",
      },
    },
  ],
  audios: [
    {
      id: "Q01YXERpbm9zYXVydXMgc3RlcmVvcGhvbmljdXNcQ0QxXDExIC0gTmVnYXRpaXZpbmVuIGFsa3Vzb2l0dG8ubXAz",
      name: "Negatiivinen alkusoitto",
      artistName: "CMX",
      artistUrl: "http://100.79.27.108:4200/artist/Q01Y",
      albumId: "Q01YXERpbm9zYXVydXMgc3RlcmVvcGhvbmljdXM",
      albumName: "Dinosaurus stereophonicus",
      albumUrl: "http://100.79.27.108:4200/album/Q01YXERpbm9zYXVydXMgc3RlcmVvcGhvbmljdXM",
      url: "http://100.79.27.108:4200/file/Q01YXERpbm9zYXVydXMgc3RlcmVvcGhvbmljdXNcQ0QxXDExIC0gTmVnYXRpaXZpbmVuIGFsa3Vzb2l0dG8ubXAz",
      track: "1.11",
      fileUrl:
        "http://100.79.27.108:4200/file/Q01YXERpbm9zYXVydXMgc3RlcmVvcGhvbmljdXNcQ0QxXDExIC0gTmVnYXRpaXZpbmVuIGFsa3Vzb2l0dG8ubXAz",
      coverUrl:
        "http://100.79.27.108:4200/file/Q01YXERpbm9zYXVydXMgc3RlcmVvcGhvbmljdXNcQ0QyXERpbm9zYXVydXMgU3RlcmVvcGhvbmljdXMuanBn",
      metadata: {
        track: {
          no: "11",
          of: "11",
        },
        disk: {
          no: "1",
          of: null,
        },
        album: "Dinosaurus Stereophonicus",
        year: 2000,
        replayGainTrackGain: {
          dB: 9.84,
          ratio: 9.638290236239705,
        },
        replayGainTrackPeak: {
          dB: -8.464808613331392,
          ratio: 0.142403,
        },
        replayGainAlbumGain: {
          dB: -9.12,
          ratio: 0.1224616199265049,
        },
        replayGainAlbumPeak: {
          dB: 0.7164602560961433,
          ratio: 1.179359,
        },
        title: "Negatiivinen alkusoitto",
        artists: ["CMX"],
        artist: "CMX",
        encoderSettings:
          "Audiograbber 1.83.01, LAME dll 3.99, 320 Kbit/s, Joint Stereo, Normal quality",
        genre: ["Rock"],
        bitrate: 320000,
        duration: 78.10612244897959,
        sampleRate: 44100,
        dynamicRange: "9",
        dynamicRangeAlbum: "7",
      },
    },
  ],
};

export const emptyFindResultFixture = {
  artists: [],
  albums: [],
  songs: [],
};
