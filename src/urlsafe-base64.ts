import UrlSafeBase64 from "urlsafe-base64";

const encode = (s: string): string => {
  return UrlSafeBase64.encode(Buffer.from(s));
};

const decode = (s: string): string => {
  return UrlSafeBase64.decode(s).toString("utf-8");
};

export default {
  encode,
  decode,
};
