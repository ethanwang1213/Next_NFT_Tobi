import { useAuth } from "@/contexts/AuthProvider";
import { useEditProfile } from "@/contexts/EditProfileProvider";
import { useEffect, useRef } from "react";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormGetValues,
  UseFormWatch,
} from "react-hook-form";
import { EditProfileValues } from "../EditProfileModal";

type Props = {
  register: UseFormRegister<EditProfileValues>;
  getValues: UseFormGetValues<EditProfileValues>;
  watch: UseFormWatch<EditProfileValues>;
  setValue: UseFormSetValue<EditProfileValues>;
  isModalOpen: boolean;
};

/**
 * プロフィール編集モーダルのアイコン選択部分
 * @param param0
 * @returns
 */
const IconSelect: React.FC<Props> = ({
  register,
  getValues,
  watch,
  setValue,
  isModalOpen,
}) => {
  const { user } = useAuth();

  const { isCropModalOpen, iconForCrop, cropData } = useEditProfile();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 初期化処理
  useEffect(() => {
    if (!user) return;
    if (!isModalOpen) return;

    setValue(
      "iconUrl",
      user.icon !== "" ? user.icon : "/mocks/images/profile.png"
    );
    cropData.set(null);
  }, [user, isModalOpen]);

  // プロフィール編集モーダルのアイコンプレビューを表示
  // クロップのプレビューを軽量で表示するためにcanvasを使用している
  useEffect(() => {
    if (!canvasRef.current) return;
    if (!isModalOpen) return;

    // メソッド定義：画像オブジェクトの生成
    const createImage = (url: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.src = url;
      });

    // メソッドの定義：アイコンプレビュー用キャンバスの描画
    const displayCanvas = async () => {
      canvasRef.current.width = 100;
      canvasRef.current.height = 100;
      const ctx = canvasRef.current.getContext("2d");
      const image = await createImage(getValues("iconUrl"));

      if (cropData.current) {
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

    // 実行
    displayCanvas();
  }, [canvasRef.current, isModalOpen, watch("iconUrl")]);

  // 画像選択時の処理
  const handleIconChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.currentTarget.files[0];
    if (!file) return;

    file.arrayBuffer().then(() => {
      // 表示用にURLをセット
      const url = URL.createObjectURL(file);
      iconForCrop.set(url);
      // クロップウィンドウを開く
      isCropModalOpen.set(true);
    });
  };

  // クロップモーダルが閉じられたときにiconUrlを更新する
  useEffect(() => {
    if (cropData.current) {
      setValue("iconUrl", iconForCrop.current);
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
        {...register("iconUrl")}
        onChange={handleIconChange}
      />
      <div className="w-[20%] aspect-square relative">
        <label htmlFor="new-icon">
          {getValues("iconUrl") && (
            <canvas
              ref={canvasRef}
              className="rounded-full overflow-hidden border-4 border-black/50"
            ></canvas>
          )}
        </label>
      </div>
    </>
  );
};

export default IconSelect;
