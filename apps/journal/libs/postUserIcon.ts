import { db, storage } from "@/firebase/client";
import { doc, setDoc } from "@firebase/firestore";
import { ref, uploadBytes } from "@firebase/storage";

export const postUserIcon = async (uid: string, icon: File) => {
  try {
    console.log(uid);
    const ext = icon.name.split(".").pop();
    const storageRef = ref(storage, `users/${uid}/icon.${ext}`);
    await uploadBytes(storageRef, icon);

    const url = `/127.0.0.1:7777/users%2F${uid}%2Ficon.${ext}?alt=media`;
    const usersSrcRef = doc(db, `users/${uid}`);
    setDoc(usersSrcRef, { icon: url }, { merge: true });
    return url;
  } catch (error) {
    console.log(error);
  }
};
