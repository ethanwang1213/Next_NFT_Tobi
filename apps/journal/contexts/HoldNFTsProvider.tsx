import { HouseBadgeNFTData, NFTData } from "@/types/type";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthProvider";
import useFetchNftDatas from "@/hooks/useFetchNftDatas";
import { HOUSE_BADGE_NFT_ID, NEKO_NFT_ID } from "@/libs/constants";

type Props = {
  children: ReactNode;
};

type HoldNFTsContextType = {
  nekoNFTs: {
    current: NFTData[];
    set: React.Dispatch<React.SetStateAction<NFTData[]>>;
  };
  otherNFTs: {
    current: (NFTData | HouseBadgeNFTData)[];
    set: React.Dispatch<React.SetStateAction<(NFTData | HouseBadgeNFTData)[]>>;
  };
  shouldUpdate: {
    current: boolean;
    set: React.Dispatch<React.SetStateAction<boolean>>;
  };
};

const HoldNFTsContext = createContext<HoldNFTsContextType>(
  {} as HoldNFTsContextType
);

export const HoldNFTsProvider: React.FC<Props> = ({ children }) => {
  const [nekoNFTs, setNekoNFTs] = useState<NFTData[]>([]);
  const [otherNFTs, setOtherNFTs] = useState<(NFTData | HouseBadgeNFTData)[]>(
    []
  );

  const [shouldUpdate, setShouldUpdate] = useState(false);

  const { user } = useAuth();
  const { fetchNFTCollectionIds, fetchHoldNFTs } = useFetchNftDatas();

  // TOBIRA NEKOのNFTを取得
  const loadNekos = async () => {
    if (!user) return;

    const nekos = await fetchHoldNFTs(NEKO_NFT_ID);
    setNekoNFTs(nekos);
    console.log(nekos);
  };

  // 他のNFTを取得
  const loadOtherNFTs = async () => {
    if (!user) return;
    const ids = await fetchNFTCollectionIds();
    const otherNFTs = [];
    await Promise.all(
      ids.map(async (id) => {
        if (id === NEKO_NFT_ID) return;
        if (id === HOUSE_BADGE_NFT_ID) {
          const nfts = (await fetchHoldNFTs(id)) as HouseBadgeNFTData[];
          otherNFTs.push(...nfts);
        } else {
          const nfts = (await fetchHoldNFTs(id)) as NFTData[];
          otherNFTs.push(...nfts);
        }
      })
    );
    setOtherNFTs(otherNFTs);
    console.log(otherNFTs);
  };

  // 初期化処理。NFTのデータを取得
  useEffect(() => {
    if (!user) return;

    console.log(user);
    loadNekos();
    loadOtherNFTs();
  }, [user]);

  // NFTのデータを更新
  // TODO: 引き換え処理のレスポンスでurlを返してもらう
  useEffect(() => {
    if (!user) return;

    if (shouldUpdate) {
      loadNekos();
      loadOtherNFTs();
    }
  }, [shouldUpdate]);

  const holdNFTContextValue = useMemo<HoldNFTsContextType>(
    () => ({
      nekoNFTs: {
        current: nekoNFTs,
        set: setNekoNFTs,
      },
      otherNFTs: {
        current: otherNFTs,
        set: setOtherNFTs,
      },
      shouldUpdate: {
        current: shouldUpdate,
        set: setShouldUpdate,
      },
    }),
    [
      nekoNFTs,
      setNekoNFTs,
      otherNFTs,
      setOtherNFTs,
      shouldUpdate,
      setShouldUpdate,
    ]
  );

  return (
    <HoldNFTsContext.Provider value={holdNFTContextValue}>
      {children}
    </HoldNFTsContext.Provider>
  );
};

export const useHoldNFTs = () => useContext(HoldNFTsContext);
