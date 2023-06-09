import { doc, writeBatch } from "firebase/firestore"
import { db } from "./client";

export const createUser = async (uid: string, discordId: string) => {
  const batch = writeBatch(db);
  const docRef = doc(db, "users", uid);
  batch.set(docRef, {
    discord: discordId,
  }, { merge: true });
  const indexRef = doc(db, "index", "users", "discord", discordId);
  batch.set(indexRef, {
    userId: uid,
  }, { merge: true });
  try {
    await batch.commit();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
