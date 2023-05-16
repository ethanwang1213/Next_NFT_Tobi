import { doc, writeBatch } from "firebase/firestore"
import { db } from "./client";

export const createUser = async (uid: string, discordId: string) => {
  const batch = writeBatch(db);
  const docRef = doc(db, "users", uid)
  batch.set(docRef, {
    discordId,
  });
  const indexRef = doc(db, "index", "users", "discord", discordId);
  batch.set(indexRef, {
    user: uid,
  });
  await batch.commit()
};
