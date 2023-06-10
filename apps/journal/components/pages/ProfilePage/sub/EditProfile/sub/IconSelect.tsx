import { useAuth } from "@/contexts/AuthProvider";
import { useEditProfile } from "@/contexts/EditProfileProvider";
import { useEffect, useRef, useState } from "react";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormGetValues,
  UseFormWatch,
} from "react-hook-form";
import { EditProfileValues } from "../EditProfileModal";
import DefaultIcon from "../../../../../../public/images/icon/Profiledefault_journal.svg";
import Image from "next/image";

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
  const imageRef = useRef<HTMLImageElement>(null);
  const [naturalWidth, setNaturalWidth] = useState<number>(0);
  const [naturalHeight, setNaturalHeight] = useState<number>(0);

  // 初期化処理
  useEffect(() => {
    if (!user) return;
    if (!isModalOpen) return;

    setValue("iconUrl", user.icon !== "" ? user.icon : "");
    cropData.set(null);
  }, [user, isModalOpen]);

  // プロフィール編集モーダルのアイコンプレビューを表示
  // クロップのプレビューを軽量で表示するためにcanvasを使用している
  useEffect(() => {
    if (!canvasRef.current) return;
    if (!imageRef.current) return;
    if (!isModalOpen) return;

    // メソッドの定義：アイコンプレビュー用キャンバスの描画
    const displayCanvas = async () => {
      if (getValues("iconUrl") === "") return;
      canvasRef.current.width = 100;
      canvasRef.current.height = 100;
      if (getValues("iconUrl") === "") return;
      const ctx = canvasRef.current.getContext("2d");
      const image = imageRef.current;
      ctx.resetTransform();
      if (cropData.current) {
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
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
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.scale(100 / naturalWidth, 100 / naturalHeight);
        ctx.drawImage(image, 0, 0);
      }
      ctx.save();
    };

    // 実行
    displayCanvas();
  }, [
    canvasRef.current,
    imageRef.current,
    isModalOpen,
    watch("iconUrl"),
    naturalWidth,
    naturalHeight,
  ]);

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
        <label htmlFor="new-icon" className="cursor-pointer">
          {getValues("iconUrl") ? (
            <canvas
              ref={canvasRef}
              className="rounded-full overflow-hidden border-4 border-black/50"
            ></canvas>
          ) : (
            <div className="rounded-full overflow-hidden border-4 border-black/50">
              <DefaultIcon />
            </div>
          )}
        </label>
        {getValues("iconUrl") && (
          <Image
            onLoadingComplete={(img) => {
              setNaturalWidth(img.naturalWidth);
              setNaturalHeight(img.naturalHeight);
            }}
            ref={imageRef}
            src={getValues("iconUrl")}
            alt="canvas-img"
            fill
            style={{ objectFit: "contain" }}
            className="invisible"
          />
        )}
      </div>
    </>
  );
};

export default IconSelect;
