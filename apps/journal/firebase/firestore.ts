import { doc, writeBatch } from "firebase/firestore"
import { db } from "./client";

export const createUser = async (uid: string, discordId: string) => {
  const batch = writeBatch(db);
  const docRef = doc(db, "users", uid)
  batch.set(docRef, {
    discord: discordId,
  });
  const indexRef = doc(db, "index", "users", "discord", discordId);
  batch.set(indexRef, {
    userId: uid,
  });
  try {
    await batch.commit();
    return true;
  } catch (e) {
    return false;
  }
};
