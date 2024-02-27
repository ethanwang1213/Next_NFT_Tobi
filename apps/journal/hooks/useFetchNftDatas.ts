import { collection, getDocs } from "firebase/firestore/lite";
import { useAuth } from "journal-pkg/contexts/journal-AuthProvider";
import { db } from "journal-pkg/fetchers/firebase/journal-client";

const useFetchNftDatas = () => {
  const { user } = useAuth();

  const fetchNftCollectionIds = async () => {
    try {
      const snapshots = await getDocs(collection(db, `users`, user.id, `nft`));
      const ids = [];
      snapshots.forEach((nftId) => {
        ids.push(nftId.id);
      });
      return ids;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const fetchHoldNfts = async (collectionId: string) => {
    try {
      const nftSnap = await getDocs(collection(db, `users`, user.id, `nft`));
      if (nftSnap.empty) return [];

      const snapshots = await getDocs(
        collection(db, `users`, user.id, `nft`, collectionId, "hold"),
      );
      const nfts = [];
      snapshots.forEach((nft) => {
        const data = nft.data();
        data["collectionId"] = collectionId;
        nfts.push(data);
      });
      return nfts;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  return {
    fetchNftCollectionIds,
    fetchHoldNfts,
  };
};

export default useFetchNftDatas;
