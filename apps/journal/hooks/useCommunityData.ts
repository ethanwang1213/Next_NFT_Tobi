import { useAuth } from "@/contexts/AuthProvider";
import { db } from "@/firebase/client";
import { HouseData } from "@/types/type";
import {
  getDocs,
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore/lite";

/**
 * communityのデータを扱うカスタムフック
 * @returns
 */
const useCommunityData = () => {
  const { user } = useAuth();

  const fetchHouseData = async () => {
    try {
      const communitySnap = await getDocs(
        collection(db, "users", user.id, "community")
      );
      if (communitySnap.empty) return null;

      const ref = doc(db, "users", user.id, "community", "house");
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;

      const houseData = snap.data() as HouseData;
      return houseData;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  // firestoreに修正データを送信する
  const postHouseType = async (fixedType: string) => {
    try {
      const ref = doc(db, "users", user.id, "community", "house");
      await setDoc(ref, { type: fixedType }, { merge: true });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // タイポを修正する。修正されない場合はnullを返す
  const fixHouseTypo = async (houseData: HouseData) => {
    if (!houseData) {
      return null;
    }

    let fixedHouseType = "";
    // 修正するタイポはここで指定している
    if (houseData.type === "hydor") {
      fixedHouseType = "hudor";
    }

    if (fixedHouseType === "") return null;
    // 修正を実行
    const res = await postHouseType(fixedHouseType);
    if (!res) return null;

    return fixedHouseType;
  };

  // エントリーポイント
  // HouseDataを取得し、必要であればHouseTypeのタイポを修正する
  const loadHouseData = async () => {
    // HouseDataのロード
    const houseData = await fetchHouseData();
    if (!houseData) return houseData;

    // タイポを修正する
    const fixedHouseType = await fixHouseTypo(houseData);
    if (!!fixedHouseType) {
      houseData.type = fixedHouseType;
    }
    return houseData;
  };

  return { loadHouseData };
};

export default useCommunityData;
