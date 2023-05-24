import { useEditProfile } from "@/contexts/EditProfileProvider";
import { useEffect, useRef } from "react";

type Props = {
  iconUrl: string;
  setIconUrl: React.Dispatch<React.SetStateAction<string>>;
};

/**
 * プロフィール編集モーダルのアイコン選択部分
 * @param param0
 * @returns
 */
const IconSelect: React.FC<Props> = ({ iconUrl, setIconUrl }) => {
  const { isCropModalOpen, iconForCrop, cropData } = useEditProfile();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // プロフィール編集モーダルのアイコンプレビューを表示
  // クロップのプレビューを軽量で表示するためにcanvasを使用している
  useEffect(() => {
    if (!canvasRef.current) return;

    // 画像オブジェクトの生成
    const createImage = (url: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.src = url;
      });

    // アイコンプレビュー用キャンバスの描画
    const displayCanvas = async () => {
      canvasRef.current.width = 100;
      canvasRef.current.height = 100;
      const ctx = canvasRef.current.getContext("2d");
      const image = await createImage(iconUrl);

      if (!!cropData.current) {
        ctx.drawImage(
          image,
          cropData.current.x,
          cropData.current.y,
          cropData.current.width,
          cropData.current.height,
          0,
          0,
          100,
          100
        );
      } else {
        ctx.scale(100 / image.naturalWidth, 100 / image.naturalHeight);
        ctx.drawImage(image, 0, 0);
      }
    };

    displayCanvas();
  }, [isCropModalOpen.current, canvasRef.current, iconUrl, cropData.current]);

  // 画像選択時の処理
  const handleIconChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.currentTarget.files[0];
    if (!file) return;

    file.arrayBuffer().then(() => {
      // 表示用にURLをセット
      const url = URL.createObjectURL(file);
      setIconUrl(url);
      iconForCrop.set(url);
      // クロップウィンドウを開く
      isCropModalOpen.set(true);
    });
  };

  // クロップモーダルが閉じられたときにiconUrlを更新する
  // TODO: iconUrlとiconForCropが二つあるのは無駄なので、Context(iconForCrop)側でまとめたい
  useEffect(() => {
    if (!!cropData.current) {
      setIconUrl(iconForCrop.current);
      iconForCrop.set("");
    }
  }, [cropData.current]);

  return (
    <>
      <input
        id="new-icon"
        type="file"
        accept="image/png, image/jpeg, image/bmp, image/tiff"
        className="hidden"
        onChange={(ev) => handleIconChange(ev)}
        onClick={(ev) => {
          console.log("click");
          ev.currentTarget.value = "";
        }}
      />
      <div className="w-[20%] aspect-square relative">
        <label htmlFor="new-icon">
          {iconUrl && <canvas ref={canvasRef}></canvas>}
        </label>
      </div>
    </>
  );
};

export default IconSelect;
