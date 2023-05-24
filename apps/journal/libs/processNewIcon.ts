import Jimp from "jimp";
import { Area } from "react-easy-crop";

/**
 * プロフィール編集画面で、アイコン画像のアップロード時に呼ばれる。
 * @param imageUrl
 * @param cropData
 * @returns
 */
const processNewIcon = async (imageUrl: string, cropData: Area) => {
  let img = await Jimp.read(imageUrl);

  // 画像のクロップ
  img = img.crop(cropData.x, cropData.y, cropData.width, cropData.height);

  // 400x400内に収めるようにスケール
  const maxLength = 400;
  if (img.getWidth() >= maxLength || img.getHeight() >= maxLength) {
    img.scaleToFit(maxLength, maxLength);
  }
  return img;
};

export default processNewIcon;
