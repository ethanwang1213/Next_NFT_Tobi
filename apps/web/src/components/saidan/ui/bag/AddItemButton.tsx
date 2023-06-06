import { ChangeEvent, useEffect, useRef } from "react";
import { HiPlus } from "react-icons/hi";
import Jimp from "jimp";
import useSaidanStore from "@/stores/saidanStore";
import { postSrcImage } from "@/../pages/api/item";
import scaleImage from "@/methods/saidan/scaleImage";
import generateHash from "@/methods/saidan/generateHash";

/**
 * 新しい画像を投稿するボタンのコンポーネント
 * @returns
 */
const AddItemButton = () => {
  const tutorialPhase = useSaidanStore((state) => state.tutorialPhase);
  const isSpotted = useSaidanStore((state) => state.isSpotted);
  const addNewSrc = useSaidanStore((state) => state.addNewSrc);
  const isPolicyAccepted = useSaidanStore((state) => state.isPolicyAccepted);
  const openPolicy = useSaidanStore((state) => state.openPolicy);
  const setImageInputRef = useSaidanStore((state) => state.setImageInputRef);

  const inputRef = useRef<HTMLInputElement>(null);

  // 入力データの更新
  useEffect(() => {
    if (!inputRef.current) return;
    setImageInputRef(inputRef);
  }, [inputRef.current]);

  // ユーザーが画像を選択したら、素材として追加し、サーバーに画像をアップロード
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!isPolicyAccepted) return;
    if (!e.currentTarget.files || e.currentTarget.files.length === 0) return;
    const file = e.currentTarget.files[0];
    // const srcId = totalSrcCount;
    const srcId = await generateHash();
    // 画像のurl生成
    const imageUrl = window.URL.createObjectURL(file);
    // 大きすぎる画像は縮小する
    const img = await scaleImage(imageUrl);
    // 素材として画像を追加
    img.getBase64(Jimp.MIME_PNG, (err, src) => {
      // console.log(srcId);
      addNewSrc(srcId, src);
    });
    // 画像ファイルをアップロード
    img.getBuffer(Jimp.MIME_PNG, async (err, buf) => {
      const uploadedUrl = await postSrcImage(
        srcId,
        new File([buf], "img.png", { type: "image/png" })
      );
      // 画像ファイルアップロード時には、
      // フロントでもbase64のようなurlとして扱えるデータを生成するため、
      // stateに保存する必要はない
      // console.log(uploadedUrl);
    });
  };

  return (
    <div
      className={`saidan-add-btn-container-outer
        ${
          tutorialPhase === "ADD_ITEM" && isSpotted
            ? "saidan-add-btn-container-spotted"
            : ""
        }`}
    >
      <div className="saidan-add-btn-container-inner">
        <label htmlFor="add-item" className="saidan-add-btn">
          <div className="w-full aspect-square">
            <HiPlus
              color="#515152"
              className=" aspect-square w-full h-full"
              viewBox="0 0 20 20"
            />
            <input
              className="hidden"
              id="add-item"
              type={`${isPolicyAccepted ? "file" : "button"}`}
              name="image"
              accept="image/png, image/jpeg, image/bmp, image/tiff"
              onChange={(e) => handleChange(e)}
              onClick={() => {
                if (isPolicyAccepted) return;
                openPolicy();
              }}
              ref={inputRef}
            />
          </div>
        </label>
      </div>
    </div>
  );
};

export default AddItemButton;
