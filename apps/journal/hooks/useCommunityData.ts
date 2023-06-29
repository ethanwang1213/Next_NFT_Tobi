import { useAuth } from "@/contexts/AuthProvider"
import { db } from "@/firebase/client";
import { HouseData } from "@/types/type";
import { getDocs, collection, doc, getDoc } from "@firebase/firestore";



/**
 * communityのデータを扱うカスタムフック
 * @returns 
 */
const useCommunityData = () => {
  const { user } = useAuth();

  const fetchHouseData = async () => {
    try {
      const communitySnap = await getDocs(collection(db, "users", user.id, "community"));
      if (communitySnap.empty) return null;

      const ref = doc(db, "users", user.id, "community", "house");
      const snap = await getDoc(ref)
      if (!snap.exists()) return null

      const houseData = snap.data() as HouseData;
      return houseData;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  return { fetchHouseData }
}

export default useCommunityData