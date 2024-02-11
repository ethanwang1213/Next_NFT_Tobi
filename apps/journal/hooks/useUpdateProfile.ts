import { EditProfileValues } from "@/components/pages/ProfilePage/sub/EditProfile/EditProfileModal";
import { useEditProfile } from "@/contexts/journal-EditProfileProvider";
import { doc, setDoc } from "firebase/firestore/lite";
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import * as _Jimp from "jimp";
import { useAuth } from "journal-pkg/contexts/journal-AuthProvider";
import { db, storage } from "journal-pkg/fetchers/firebase/journal-client";
import { Area } from "react-easy-crop";

type PostingData = {
  icon?: string;
  name?: string;
  birthday?: {
    year?: number;
    month?: number;
    day?: number;
  };
};

const useUpdateProfile = () => {
  const Jimp =
    typeof self !== "undefined" ? (self as any).Jimp || _Jimp : _Jimp;
  const auth = useAuth();
  const { cropData } = useEditProfile();

  // "(timestamp)(uid)"の形式の文字列をハッシュ化した値を得る
  const generateHash = async () => {
    const txt = `${Date.now()}${auth.user.id}`;
    const encoded = new TextEncoder().encode(txt);
    const hashBuf = await crypto.subtle.digest("SHA-256", encoded);
    const hashArr = Array.from(new Uint8Array(hashBuf));
    const hashHex = hashArr
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  // プロフィール編集画面で、アイコン画像のアップロード時に呼ばれる。
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

  // db用データの生成
  // アイコンのパスはstorageへアップロード後に追加するのでここではスルー
  const createPostingDataWithoutIcon = (
    name: string,
    year: number,
    month: number,
    day: number,
  ) => {
    const postingData: PostingData = {};
    let isAnyChanged = false;
    // ユーザー名
    if (name !== auth.user.name) {
      postingData["name"] = name;
      isAnyChanged = true;
    }
    // 誕生日
    if (
      year !== auth.user.birthday?.year ||
      month !== auth.user.birthday?.month ||
      day !== auth.user.birthday?.day
    ) {
      postingData["birthday"] = {};
      isAnyChanged = true;
    }
    if (year !== auth.user.birthday?.year) {
      postingData["birthday"]["year"] = year;
    }
    if (month !== auth.user.birthday?.month) {
      postingData["birthday"]["month"] = month;
    }
    if (day !== auth.user.birthday?.day) {
      postingData["birthday"]["day"] = day;
    }
    // console.log(obj);

    return { postingData, isAnyChanged };
  };

  // アイコンのパスをdb用の形式に変換
  const processIconPath = (iconPath: string) => `/proxy/${iconPath}?alt=media`;

  // 新しいアイコンをfirebase storageにアップロード
  const uploadNewIcon = async (icon: File) => {
    try {
      // アイコンpngファイルのアップロード
      const hash = await generateHash();
      const ext = icon.name.split(".").pop();
      const newPath = `users/${auth.user.id}/icon/${hash}.${ext}`;
      const storageRef = ref(storage, newPath);
      await uploadBytes(storageRef, icon);

      return newPath.replaceAll("/", "%2F");
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const deleteOldIcon = async () => {
    try {
      // 古いアイコンの削除
      if (auth.dbIconUrl !== "") {
        const oldPath = auth.dbIconUrl
          .replace(/^\/proxy\/(.*\.png)\?alt=media$/, "$1")
          .replace(/%2F/g, "/");
        const oldRef = ref(storage, oldPath);
        await deleteObject(oldRef);
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // 変更があったプロフィールについて、firestore上の情報を更新する
  const postProfile = async (postingData: PostingData) => {
    try {
      // プロフィール情報の更新
      const usersSrcRef = doc(db, `users/${auth.user.id}`);
      setDoc(usersSrcRef, postingData, { merge: true });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // このhookのエントリポイント
  const updateProfile = async (formValues: EditProfileValues) => {
    const { iconUrl, newName } = formValues;
    // 誕生日のフォームをクリアしたときに、string型になってしまったりするので、
    // 正常な値に変換する
    let { year, month, day } = formValues;
    if (typeof year === "string") {
      if (year === "") year = 0;
      else year = parseInt(year);
    }
    if (typeof month === "string") {
      if (month === "") month = 0;
      else month = parseInt(month);
    }
    if (typeof day === "string") {
      if (day === "") day = 0;
      else day = parseInt(day);
    }

    try {
      const isNewIcon = !!cropData.current;
      const { postingData, isAnyChanged } = createPostingDataWithoutIcon(
        newName,
        year,
        month,
        day,
      );
      if (!isNewIcon && !isAnyChanged) {
        return;
      }

      if (isNewIcon) {
        // アイコン画像に変更があればアップロード

        const scaled = await processNewIcon(iconUrl, cropData.current);
        scaled.getBuffer(Jimp.MIME_PNG, async (err, buf) => {
          // storageに新しいアイコン画像データをアップロード
          const path = await uploadNewIcon(
            new File([buf], "img.png", { type: "image/png" }),
          );

          if (!path) {
            throw new Error("failed to upload new icon");
          }
          // db用データにユーザーアイコンurlを追加
          postingData["icon"] = processIconPath(path);

          // db上のプロフィール情報を更新
          const posted = await postProfile(postingData);
          if (!posted) {
            throw new Error("failed to post profile, or there are no changes");
          }

          // storageから古いアイコン画像データを削除
          // storageとdbの整合性を保つため、アイコンアップロードと情報更新が成功した後に削除をする
          await deleteOldIcon();
          // deleteが失敗しても整合性は保たれるので、そのままローカルの更新を行う
          // TODO: storageとdbの整合性は保っているが、storage上の古い画像削除がエラーになると、storageに無駄な画像が残ってしまう

          // ローカルのプロフィール情報を更新
          scaled.getBase64(Jimp.MIME_PNG, async (err, src) => {
            auth.updateProfile(
              src,
              newName,
              {
                year: year,
                month: month,
                day: day,
              },
              path,
            );
          });
        });
      } else {
        // db上のプロフィール情報を更新
        const posted = await postProfile(postingData);
        if (!posted) {
          throw new Error("failed to post profile, or there are no changes");
        }

        // ローカルのプロフィール情報を更新
        auth.updateProfile(
          iconUrl,
          newName,
          {
            year: year,
            month: month,
            day: day,
          },
          null,
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { updateProfile };
};

export default useUpdateProfile;
