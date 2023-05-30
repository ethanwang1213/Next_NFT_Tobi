import { useAuth } from "@/contexts/AuthProvider";
import { db } from "@/firebase/client";
import { getDocs, collection } from "@firebase/firestore";

const useFetchNftDatas = () => {
  const { user } = useAuth();

  const fetchNFTCollectionIds = async () => {
    try {
      const snapshots = await getDocs(collection(db, `users`, user.id, `nft`));
      const ids = [];
      snapshots.forEach((nftId) => {
        // console.log(doc.id, doc.data());
        ids.push(nftId.id);
      });
      return ids;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchHoldNFTs = async (collectionId: string) => {
    try {
      const snapshots = await getDocs(
        collection(db, `users`, user.id, `nft`, collectionId, "hold")
      );
      const nfts = [];
      snapshots.forEach((nft) => {
        // console.log(nft.data());
        nfts.push(nft.data());
      });
      return nfts;
    } catch (error) {
      console.log(error);
    }
  };

  return { fetchNFTCollectionIds, fetchHoldNFTs };
};

export default useFetchNftDatas;
