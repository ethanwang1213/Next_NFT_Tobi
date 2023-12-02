import { doc, setDoc } from "firebase/firestore/lite";
import { ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "fetchers/firebase/client";

/**
 * ストレージに画像データを追加し、そのurlをデータベースに保存する
 * @param srcId
 * @returns
 */
export const postSrcImage = async (srcId: string, image: File) => {
  try {
    const uid = auth.currentUser?.uid;
    const ext = image.name.split(".").pop();
    const storageRef = ref(storage, `users/${uid}/item/${srcId}/image.${ext}`);
    await uploadBytes(storageRef, image);
    const url = `/proxy/users%2F${uid}%2Fitem%2F${srcId}%2Fimage.${ext}?alt=media`;
    const usersSrcRef = doc(db, `users/${uid}/src/${srcId}`);
    setDoc(
      usersSrcRef,
      { imageSrc: url, createdAt: Date.now() },
      { merge: true }
    );
    return url;
  } catch (error) {
    console.log(error);
  }
  return null;
};
