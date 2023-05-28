import Jimp from 'jimp';

/**
 * 透過背景を白背景にした画像のソースを取得する。
 * @param imageUrl 元画像のurl
 * @returns 
 */
const getWhitedImageSrc = async (imageUrl: string) => {
  const img = await Jimp.read(imageUrl);
  const srcW = img.getWidth();
  const srcH = img.getHeight();
  const whited = new Jimp(srcW, srcH, "white");
  whited.blit(img, 0, 0);
  const result = await whited.getBase64Async("image/jpeg")
  return result;
}

export default getWhitedImageSrc;