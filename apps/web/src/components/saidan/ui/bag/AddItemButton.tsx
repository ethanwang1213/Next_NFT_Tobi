import { ChangeEvent, useEffect, useRef, useState } from "react";
import { HiPlus } from "react-icons/hi";
import useSaidanStore from "@/stores/saidanStore";
import { postSrcImage } from "@/../pages/api/item";
import scaleImage from "@/methods/saidan/scaleImage";
import generateHash from "@/methods/saidan/generateHash";
import * as _Jimp from "jimp";
import ClosePolicyButton from "../policy/ClosePolicyButton";
import { useAuth } from "@/context/auth";
import { doc, updateDoc } from "firebase/firestore/lite";
import { db } from "fetchers/firebase/client";

/**
 * 新しい画像を投稿するボタンのコンポーネント
 * @returns
 */
const AddItemButton = () => {
  const Jimp =
    typeof self !== "undefined" ? (self as any).Jimp || _Jimp : _Jimp;
  const tutorialPhase = useSaidanStore((state) => state.tutorialPhase);
  const isSpotted = useSaidanStore((state) => state.isSpotted);
  const addNewSrc = useSaidanStore((state) => state.addNewSrc);
  const isPolicyAccepted = useSaidanStore((state) => state.isPolicyAccepted);
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
    img.getBase64(Jimp.MIME_PNG, (err: any, src: string) => {
      // console.log(srcId);
      addNewSrc(srcId, src);
    });
    // 画像ファイルをアップロード
    img.getBuffer(Jimp.MIME_PNG, async (err: any, buf: Buffer) => {
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

  // 利用規約表示用
  const auth = useAuth();
  const acceptPolicy = useSaidanStore((state) => state.acceptPolicy);
  const imageInputRef = useSaidanStore((state) => state.imageInputRef);

  const termsModalRef = useRef<HTMLDialogElement>(null);
  const [height, setHeight] = useState<string>("90%");
  const [disabled, setDisabled] = useState(true);
  const handleCheckChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setDisabled(!ev.currentTarget.checked);
  };
  const handleSubmit = () => {
    acceptPolicy();
    if (auth) {
      const ref = doc(db, `users/${auth.id}`);
      updateDoc(ref, { policyAccepted: true });
    }
  };
  // 利用規約同意済みならばローカル変数をアップデート
  // TODO: auth.policyAcceptedを使えばよい気はする
  useEffect(() => {
    if (auth?.policyAccepted) {
      acceptPolicy();
    }
  }, [auth]);

  return (
    <>
      <div
        className={`saidan-add-btn-container-outer
        ${tutorialPhase === "ADD_ITEM" && isSpotted
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
                  // openPolicy();
                  console.log("open");
                  termsModalRef.current?.showModal();
                  setHeight("100%");
                }}
                ref={inputRef}
              />
            </div>
          </label>
        </div>
      </div>
      {/* Open the modal using ID.showModal() method */}
      <dialog
        id="terms-modal"
        className="modal"
        ref={termsModalRef}
        onClose={() => {
          setHeight("90%");
          if (isPolicyAccepted) {
            imageInputRef?.current?.click();
          }
        }}
      >
        <form
          method="dialog"
          className="modal-box w-full max-w-[800px] max-h-full h-full flex flex-col p-3 sm:py-4 sm:px-6 rounded-lg"
        >
          <div className="policy-close-btn">
            <ClosePolicyButton
              onClick={() => {
                termsModalRef.current?.close();
              }}
            />
          </div>
          <div className="policy-document-container">
            <p className="policy-message">
              サービスのご利用には利用規約への同意が必要です。
            </p>
            <div
              className="grow "
              style={{
                WebkitOverflowScrolling: "touch",
                overflowY: "auto",
              }}
              data-allowscroll="true"
            >
              <iframe
                id="policy-iframe"
                src="/saidan/policy/policy.html"
                className="policy-document"
                style={{
                  display: "block",
                  height: height,
                }}
              />
            </div>
          </div>
          <div className="policy-accept-container">
            <div className="policy-accept-inner-container">
              <div className="policy-accept-check-container">
                <div className="grid content-center">
                  <input
                    id="accept"
                    type="checkbox"
                    name="accept"
                    onChange={(ev) => handleCheckChange(ev)}
                  />
                </div>
                <label htmlFor="accept" className="policy-accept-check-text">
                  利用規約に同意する
                </label>
              </div>
              <button
                disabled={disabled}
                className="policy-accept-btn"
                onClick={handleSubmit}
              >
                送信
              </button>
            </div>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default AddItemButton;
