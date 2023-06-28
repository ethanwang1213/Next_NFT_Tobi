import { useAuth } from "@/contexts/AuthProvider"
import { db } from "@/firebase/client";
import { getDocs, collection, doc, getDoc } from "@firebase/firestore";

type HouseData = {
  joined: boolean;
}

/**
 * communityのデータを扱うカスタムフック
 * @returns 
 */
const useCommunityData = () => {
  const { user } = useAuth();

  const checkJoinedCommunity = async () => {
    try {
      const communitySnap = await getDocs(collection(db, "users", user.id, "community"));
      if (communitySnap.empty) return false;

      const ref = doc(db, "users", user.id, "community", "house");
      const snap = await getDoc(ref)
      if (!snap.exists()) return false

      const houseData = snap.data() as HouseData;
      return houseData.joined;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  return { checkJoinedCommunity }
}

export default useCommunityData