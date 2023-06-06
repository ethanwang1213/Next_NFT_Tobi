import { EditProfileValues } from "@/components/pages/ProfilePage/sub/EditProfile/EditProfileModal";
import { useAuth } from "@/contexts/AuthProvider";
import { useEditProfile } from "@/contexts/EditProfileProvider";
import { storage, db } from "@/firebase/client";
import { doc, setDoc } from "@firebase/firestore";
import { ref, uploadBytes } from "@firebase/storage";

import Jimp from "jimp";
import { Area } from "react-easy-crop";

const useUpdateProfile = () => {
  const auth = useAuth();
  const { cropData } = useEditProfile();

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
      const ext = icon.name.split(".").pop();
      const storageRef = ref(storage, `users/${auth.user.id}/icon.${ext}`);
      await uploadBytes(storageRef, icon);
    } catch (error) {
      console.log(error);
    }
  };

  // 変更があったプロフィールについて、firestore上の情報を更新する
  const postProfile = async (
    isNewIcon: boolean,
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
      if (isNewIcon && auth.user.icon === "") {
        obj["icon"] = `/proxy/users%2F${auth.user.id}%2Ficon.png?alt=media`;
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
        await uploadNewIcon(new File([buf], "img.png", { type: "image/png" }));
      });
      // ローカルのプロフィール情報を更新
      scaled.getBase64(Jimp.MIME_PNG, async (err, src) => {
        auth.updateProfile(src, newName, {
          year: year,
          month: month,
          day: day,
        });
      });
    } else {
      // ローカルのプロフィール情報を更新
      auth.updateProfile(iconUrl, newName, {
        year: year,
        month: month,
        day: day,
      });
    }

    // データベース上のプロフィール情報を更新
    postProfile(isNewIcon, newName, year, month, day);
  };

  return { updateProfile };
};

export default useUpdateProfile;
