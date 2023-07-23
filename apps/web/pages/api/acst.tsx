import { doc, setDoc, updateDoc } from "firebase/firestore/lite";
import { auth, db } from "@/../firebase/client";

/**
 * アクスタ3dモデルのurlをdbに保存する
 * @param srcId
 * @returns
 */
export const postAcstModelUrl = async (srcId: string) => {
  try {
    const uid = auth.currentUser?.uid;
    const url = `/proxy/users%2F${uid}%2Fitem%2F${srcId}%2Facst.glb?alt=media`;
    const usersSrcRef = doc(db, `users/${uid}/src/${srcId}`);
    setDoc(usersSrcRef, { modelSrc: url }, { merge: true });
    return url;
  } catch (error) {
    console.log(error);
  }
  return null;
};

/**
 * アクスタの生成失敗タイムスタンプを保存する
 */
export const updateFailedAcstRequestAt = async () => {
  try {
    const uid = auth.currentUser?.uid;
    const timestamp = Date.now();

    const ref = doc(db, `users/${uid}`);
    updateDoc(ref, { failedAcstRequestAt: timestamp });
  } catch (error) {
    console.log(error);
  }
  return null;
};
