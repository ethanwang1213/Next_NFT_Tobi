import * as _Jimp from "jimp"

export const FixedJimp = typeof self !== "undefined" ? (self as any).Jimp || _Jimp : _Jimp;
