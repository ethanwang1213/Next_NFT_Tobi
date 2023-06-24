import { EditProfileValues } from "@/components/pages/ProfilePage/sub/EditProfile/EditProfileModal";
import { useAuth } from "@/contexts/AuthProvider";
import { useEditProfile } from "@/contexts/EditProfileProvider";
import { storage, db } from "@/firebase/client";
import { doc, setDoc } from "@firebase/firestore";
import { deleteObject, ref, uploadBytes } from "@firebase/storage";
import { Area } from "react-easy-crop";
import * as _Jimp from "jimp";

const useUpdateProfile = () => {
  const Jimp = typeof self !== "undefined" ? (self as any).Jimp || _Jimp : _Jimp;
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

  // 新しいアイコンをfirebase storageにアップロード
  const uploadNewIcon = async (icon: File) => {
    try {
      // アイコンpngファイルのアップロード
      const hash = await generateHash();
      const ext = icon.name.split(".").pop();
      const newPath = `users/${auth.user.id}/icon/${hash}.${ext}`;
      const storageRef = ref(storage, newPath);
      await uploadBytes(storageRef, icon);

      // 古いアイコンの削除
      if (auth.dbIconUrl !== "") {
        const oldPath = auth.dbIconUrl
          .replace(/^\/proxy\/(.*\.png)\?alt=media$/, "$1")
          .replace(/%2F/g, "/");
        const oldRef = ref(storage, oldPath);
        await deleteObject(oldRef);
      }

      const replacedNewPath = newPath.replaceAll("/", "%2F");
      return replacedNewPath;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // 変更があったプロフィールについて、firestore上の情報を更新する
  const postProfile = async (
    iconPath: string | null,
    name: string,
    year: number,
    month: number,
    day: number
  ) => {
    try {
      // プロフィール情報の更新
      const usersSrcRef = doc(db, `users/${auth.user.id}`);
      const obj = {};
      let isAnyChanged = false;
      // ユーザーアイコンurl
      // 初めてアイコンを設定するときのみ保存（アイコンに変更があってもurlは同一）
      if (iconPath) {
        obj["icon"] = `/proxy/${iconPath}?alt=media`;
        isAnyChanged = true;
      }
      // ユーザー名
      if (name !== auth.user.name) {
        obj["name"] = name;
        isAnyChanged = true;
      }
      // 誕生日
      if (
        year !== auth.user.birthday?.year ||
        month !== auth.user.birthday?.month ||
        day !== auth.user.birthday?.day
      ) {
        obj["birthday"] = {};
        isAnyChanged = true;
      }
      if (year !== auth.user.birthday?.year) {
        obj["birthday"]["year"] = year;
      }
      if (month !== auth.user.birthday?.month) {
        obj["birthday"]["month"] = month;
      }
      if (day !== auth.user.birthday?.day) {
        obj["birthday"]["day"] = day;
      }
      // console.log(obj);

      if (isAnyChanged) {
        setDoc(usersSrcRef, obj, { merge: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

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

    const isNewIcon = !!cropData.current;

    if (isNewIcon) {
      // アイコン画像に変更があればアップロード
      const scaled = await processNewIcon(iconUrl, cropData.current);
      scaled.getBuffer(Jimp.MIME_PNG, async (err, buf) => {
        const path = await uploadNewIcon(
          new File([buf], "img.png", { type: "image/png" })
        );
        // データベース上のプロフィール情報を更新
        await postProfile(path, newName, year, month, day);
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
            path
          );
        });
      });
    } else {
      // データベース上のプロフィール情報を更新
      await postProfile(null, newName, year, month, day);
      // ローカルのプロフィール情報を更新
      auth.updateProfile(
        iconUrl,
        newName,
        {
          year: year,
          month: month,
          day: day,
        },
        null
      );
    }
  };

  return { updateProfile };
};

export default useUpdateProfile;
