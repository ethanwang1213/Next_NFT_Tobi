import * as _Jimp from "jimp";

/**
 * アクスタ生成用に画像を正方形にする
 * 追加する余白は透過値で埋める
 * @param imageUrl 
 * @returns 
 */
const makeImageSquare = async (imageUrl: string) => {
  const Jimp = typeof self !== "undefined" ? (self as any).Jimp || _Jimp : _Jimp;
  const img = await Jimp.read(imageUrl);
  const srcW = img.getWidth();
  const srcH = img.getHeight();
  let sqL: number;
  let x: number;
  let y: number;
  if (srcW > srcH) {
    sqL = srcW;
    x = 0;
    y = (sqL - srcH) / 2.0;
  } else {
    sqL = srcH;
    x = (sqL - srcW) / 2.0;
    y = 0;
  }

  const bg = new Jimp(sqL, sqL, "black");
  // const bg = await Jimp.read('/saidan/acst-dummy-bg/noise.png');
  const m = 10
  bg.cover(sqL + m * 2, sqL + m * 2);

  bg.blit(img, x + m, y + m);
  // console.log(r.getWidth(), r.getHeight);
  return bg;
};

export default makeImageSquare;
