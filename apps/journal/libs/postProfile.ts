import { db, storage } from "@/firebase/client";
import { User } from "@/types/type";
import { doc, setDoc } from "@firebase/firestore";
import { ref, uploadBytes } from "@firebase/storage";

export const uploadNewIcon = async (uid: string, icon: File) => {
  try {
    // アイコンpngファイルのアップロード
    console.log(uid);
    const ext = icon.name.split(".").pop();
    const storageRef = ref(storage, `users/${uid}/icon.${ext}`);
    await uploadBytes(storageRef, icon);
  } catch (error) {
    console.log(error);
  }
};

export const postProfile = async (
  user: User,
  isNewIcon: boolean,
  name: string,
  isBirthdayHidden: boolean,
  year: number,
  month: number,
  day: number
) => {
  try {
    // プロフィール情報の更新
    const usersSrcRef = doc(db, `users/${user.id}`);
    const obj = {};
    let isAnyChanged = false;
    console.log(isNewIcon, name, year, month, day, user.name, user.birthday);
    // ユーザーアイコンurl
    if (isNewIcon) {
      const url = `/proxy/users%2F${user.id}%2Ficon.png?alt=media`;
      obj["icon"] = url;
      isAnyChanged = true;
    }
    // ユーザー名
    if (name !== user.name) {
      obj["name"] = name;
      isAnyChanged = true;
    }
    // 誕生日
    if (isBirthdayHidden !== user.isBirthdayHidden) {
      obj["isBirthdayHidden"] = isBirthdayHidden;
      isAnyChanged = true;
    }

    if (
      year !== user.birthday?.year ||
      month !== user.birthday?.month ||
      day !== user.birthday?.day
    ) {
      obj["birthday"] = {};
      isAnyChanged = true;
    }
    if (year !== user.birthday?.year) {
      obj["birthday"]["year"] = year;
    }
    if (month !== user.birthday?.month) {
      obj["birthday"]["month"] = month;
    }
    if (day !== user.birthday?.day) {
      obj["birthday"]["day"] = day;
    }
    console.log(obj);

    if (isAnyChanged) {
      setDoc(usersSrcRef, obj, { merge: true });
    }
  } catch (error) {
    console.log(error);
  }
};
