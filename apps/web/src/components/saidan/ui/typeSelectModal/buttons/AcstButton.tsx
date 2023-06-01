import makeImageSquare from "@/methods/saidan/makeImageSquare";
import useSaidanStore from "@/stores/saidanStore";
import { getDoc, doc } from "@firebase/firestore";
import axios from "axios";
import Jimp from "jimp";
import { auth, db } from "@/../firebase/client";
import {
  updateFailedAcstRequestAt,
  postAcstModelUrl,
} from "@/../pages/api/acst";
import Acst from "@/../public/saidan/saidan-ui/acst.svg";
import ItemTypeButton from "./ItemTypeButton";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

type Props = {
  imageId: string;
};

/**
 * アクスタ生成ボタン
 * @param param0
 * @returns
 */
const AcstButton: React.FC<Props> = ({ imageId }) => {
  const closeBag = useSaidanStore((state) => state.closeBag);
  const allSrcs = useSaidanStore((state) => state.allSrcs);
  const setAcstModelSrc = useSaidanStore((state) => state.setAcstModelSrc);
  const placeNewItem = useSaidanStore((state) => state.placeNewItem);
  const openAcstGeneratingMsg = useSaidanStore(
    (state) => state.openAcstGeneratingMsg
  );
  const closeAcstGeneratingMsg = useSaidanStore(
    (state) => state.closeAcstGeneratingMsg
  );
  const openAcstFailedModal = useSaidanStore(
    (state) => state.openAcstFailedModal
  );
  const setIsAcstAlreadyRequested = useSaidanStore(
    (state) => state.setIsAcstAlreadyRequested
  );
  const openAcstAlreadyRequestedModal = useSaidanStore(
    (state) => state.openAcstAlreadyRequestedModal
  );
  const closeAcstAlreadyRequestedModal = useSaidanStore(
    (state) => state.closeAcstAlreadyRequestedModal
  );

  const { executeRecaptcha } = useGoogleReCaptcha();

  // db上にアクスタモデルデータのurlが存在すれば返し、存在しない場合は空文字を返す
  const checkAcstModelSrc: () => Promise<
    [acstModelSrc: string, errorMsg: null | { title: string; text: string }]
  > = async () => {
    try {
      if (!auth.currentUser) {
        return ["", { title: "何らかのエラーが発生しました。", text: "" }];
      }
      const srcDoc = await getDoc(
        doc(db, "users", auth.currentUser.uid, "src", imageId)
      );
      if (!srcDoc.exists()) {
        return ["", { title: "何らかのエラーが発生しました。", text: "" }];
      }
      // 正常値 データが存在しない場合。
      if (!srcDoc.data().modelSrc) {
        return ["", null];
      }
      const acstSrc: string = srcDoc.data().modelSrc;
      return [acstSrc, null];
    } catch (error) {
      // console.log(error);
      return ["", { title: "何らかのエラーが発生しました。", text: "" }];
    }
  };

  // 前回の失敗から3分以上経過が確認できればtrueを返す
  const checkFailedAcstRequestAt: () => Promise<
    [
      isValidTimestamp: boolean,
      errorMsg: null | { title: string; text: string }
    ]
  > = async () => {
    try {
      if (!auth.currentUser) {
        return [false, { title: "何らかのエラーが発生しました。", text: "" }];
      }

      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (!userDoc.exists()) {
        // docが存在しなければfalse
        return [false, { title: "何らかのエラーが発生しました。", text: "" }];
      }

      const { failedAcstRequestAt } = userDoc.data();

      // 前回の生成失敗から一定時間はリクエストを受け付けない
      const diff = Date.now() - failedAcstRequestAt;
      const coolTime = 0.5 * 60 * 1000;
      const restTime = (coolTime - diff) / 1000;
      if (restTime > 0) {
        return [
          false,
          { title: "", text: `時間を置いて、もう一度お試しください` },
        ];
      }

      return [true, null];
    } catch (error) {
      return [false, { title: "何らかのエラーが発生しました。", text: "" }];
    }
  };

  const handleClick = async () => {
    const src = allSrcs.find((v) => v.id === imageId);
    if (!src) return;

    // モデルデータが存在するかどうかをチェックする
    const [acstModelSrc, srcErrorMsg] = await checkAcstModelSrc();
    if (!src.isSample && srcErrorMsg) {
      // エラー表示
      // console.log(srcErrorMsg);
      openAcstFailedModal(srcErrorMsg.title, srcErrorMsg.text);
      return;
    }

    if (src.isSample || acstModelSrc !== "") {
      // if (false) {
      // サンプルまたはアクスタ3dモデル生成済みの画像ならば、
      // 用意したデータを利用してアクスタを生成する
      await placeNewItem(src.id, "ACRYLIC_STAND", src.squareImageSrc === "");
      closeBag();
    } else {
      // 前回の生成失敗timestampをチェック
      const [isValidTimestamp, tsErrorMsg] = await checkFailedAcstRequestAt();

      // 前回の生成から十分時間が経過していない場合、失敗用モーダルを表示する
      if (!isValidTimestamp && tsErrorMsg) {
        openAcstFailedModal(tsErrorMsg?.title, tsErrorMsg?.text);
        return;
      }
      // console.log('isValidTimestamp: ', isValidTimestamp);

      // 失敗フラグテスト用
      // if (isValidTimestamp) {
      //   await updateFailedAcstRequestAt();
      //   console.log('failed')
      //   return;
      // }

      // 選択した画像素材がすでに生成リクエスト済みの場合、リクエスト済み用モーダルを表示する
      if (src.isAcstAlreadyRequested) {
        openAcstAlreadyRequestedModal();
        return;
      }

      // アクスタ生成中モーダルを表示する
      openAcstGeneratingMsg();

      // この画像素材をリクエスト済みにする
      setIsAcstAlreadyRequested(imageId, true);

      // 自動整形＆アクスタ生成
      const sqImage = await makeImageSquare(src.imageSrc);
      // console.log(sqImage.getWidth(), sqImage.getHeight());

      // 画像のバッファーデータを取得する
      sqImage.getBuffer(Jimp.MIME_PNG, async (_, data) => {
        // リクエスト用データを作成する
        const form = new FormData();
        const blob = new Blob([data], { type: "image/png" });
        form.append("file", blob);

        // ワンタイムトークンの取得
        const token = await auth.currentUser?.getIdToken(true);
        // console.log(src.id);

        // Recaptchaトークンの取得
        const recaptchaToken = await executeRecaptcha!("CONTACT");

        // image2model APIへPOSTし、アクスタモデルを生成する
        const res = await axios
          .post(
            `/i2m/?token=${token}&name=${src.id}&recaptcha=${recaptchaToken}`,
            form
          )
          .catch(async () => {
            // 失敗フラグを保存する
            await updateFailedAcstRequestAt();
            openAcstFailedModal(
              "アクリルスタンドの生成に失敗しました",
              "時間を置いて、もう一度お試しください。"
            );
            setIsAcstAlreadyRequested(imageId, false);
          });
        if (res === undefined) {
          return;
        }
        // allSrcsにアクスタurlを保存する
        const newModelUrl = `/proxy/users%2F${auth.currentUser?.uid}%2Fitem%2F${src.id}%2Facst.glb?alt=media`;
        setAcstModelSrc(src.id, newModelUrl);

        // アクスタをsaidanに配置する
        await placeNewItem(src.id, "ACRYLIC_STAND", src.squareImageSrc === "");

        // firestore db上に、アクスタデータのurlを保存する
        await postAcstModelUrl(src.id);
        // console.log(res.data);
        closeAcstGeneratingMsg();
        closeAcstAlreadyRequestedModal();

        // 本来、複数回リクエストはされないが一応
        setIsAcstAlreadyRequested(imageId, false);
      });
    }
  };

  return (
    <ItemTypeButton
      imageId={imageId}
      itemType="ACRYLIC_STAND"
      onClick={handleClick}
    >
      <div className="type-select-container font-tsukub-700">
        <div className="type-select-icon">
          <Acst />
        </div>
        <div className="type-select-text">アクスタ</div>
      </div>
    </ItemTypeButton>
  );
};

export default AcstButton;
