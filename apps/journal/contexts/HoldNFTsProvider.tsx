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

/**
 * 保有NFTのデータを管理するコンテキストプロバイダー
 * @param param0
 * @returns
 */
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
    if (!user || !user.email) return;
    const nekos = await fetchHoldNFTs(
      process.env["NEXT_PUBLIC_TOBIRANEKO_NFT_ADDRESS"]
    );
    // 最新順にソート
    nekos.sort((a, b) => {
      return (
        b.acquisition_time.toDate().getTime() -
        a.acquisition_time.toDate().getTime()
      );
    });
    setNekoNFTs(nekos);
  };

  // 他のNFTを取得
  const loadOtherNFTs = async () => {
    if (!user) return;
    const ids = await fetchNFTCollectionIds();
    
    const otherNFTs: (NFTData | HouseBadgeNFTData)[] = [];
    await Promise.all(
      ids.map(async (id) => {
        if (id === process.env["NEXT_PUBLIC_TOBIRANEKO_NFT_ADDRESS"]) return;
        if (id === process.env["NEXT_PUBLIC_HOUSE_BADGE_NFT_ADDRESS"]) {
          const nfts = (await fetchHoldNFTs(id)) as HouseBadgeNFTData[];
          otherNFTs.push(...nfts);
        } else {
          const nfts = (await fetchHoldNFTs(id)) as NFTData[];
          otherNFTs.push(...nfts);
        }
      })
    );
    // 最新順にソート
    otherNFTs.sort((a, b) => {
      return (
        b.acquisition_time.toDate().getTime() -
        a.acquisition_time.toDate().getTime()
      );
    });
    setOtherNFTs(otherNFTs);
  };

  // 初期化処理。NFTのデータを取得
  useEffect(() => {
    if (!user) return;

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
      setShouldUpdate(false);
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
