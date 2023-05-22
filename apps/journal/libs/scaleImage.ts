import Jimp from "jimp";

/**
 * 指定した辺の長さの正方形に収まらない場合、
 * 収まるように画像を縮小する
 * @param imageUrl 
 * @returns 
 */
const scaleImage = async (imageUrl: string) => {
  const img = await Jimp.read(imageUrl);
  const maxLength = 400;
  if (img.getWidth() >= maxLength || img.getHeight() >= maxLength) {
    img.scaleToFit(maxLength, maxLength);
  }
  return img;
};

export default scaleImage;
