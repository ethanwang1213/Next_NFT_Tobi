import {
  HouseBadgeNftData as HouseBadgeNftData,
  NftData as NftData,
} from "@/types/type";
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

type HoldNftsContextType = {
  nekoNfts: {
    current: NftData[];
    set: React.Dispatch<React.SetStateAction<NftData[]>>;
  };
  otherNfts: {
    current: (NftData | HouseBadgeNftData)[];
    set: React.Dispatch<React.SetStateAction<(NftData | HouseBadgeNftData)[]>>;
  };
  shouldUpdate: {
    current: boolean;
    set: React.Dispatch<React.SetStateAction<boolean>>;
  };
  viewingSrc: {
    current: string;
    set: React.Dispatch<React.SetStateAction<string>>;
  };
};

const HoldNftsContext = createContext<HoldNftsContextType>(
  {} as HoldNftsContextType
);

/**
 * 保有NFTのデータを管理するコンテキストプロバイダー
 * @param param0
 * @returns
 */
export const HoldNftsProvider: React.FC<Props> = ({ children }) => {
  const [nekoNfts, setNekoNfts] = useState<NftData[]>([]);
  const [otherNfts, setOtherNfts] = useState<(NftData | HouseBadgeNftData)[]>(
    []
  );

  const [shouldUpdate, setShouldUpdate] = useState(false);

  const { user } = useAuth();
  const { fetchNftCollectionIds, fetchHoldNfts } = useFetchNftDatas();

  const [viewingSrc, setViewingSrc] = useState<string>("");

  // TOBIRA NEKOのNFTを取得
  const loadNekos = async () => {
    if (!user || !user.email) return;
    const nekos = await fetchHoldNfts(
      process.env["NEXT_PUBLIC_NEKO_NFT_ADDRESS"]
    );
    // 最新順にソート
    nekos.sort((a, b) => {
      return (
        b.acquisition_time.toDate().getTime() -
        a.acquisition_time.toDate().getTime()
      );
    });
    setNekoNfts(nekos);
  };

  // 他のNFTを取得
  const loadOtherNfts = async () => {
    if (!user || !user.email) return;
    const ids = await fetchNftCollectionIds();

    const otherNfts: (NftData | HouseBadgeNftData)[] = [];
    await Promise.all(
      ids.map(async (id) => {
        if (id === process.env["NEXT_PUBLIC_NEKO_NFT_ADDRESS"]) return;
        if (id === process.env["NEXT_PUBLIC_HOUSE_BADGE_NFT_ADDRESS"]) {
          const nfts = (await fetchHoldNfts(id)) as HouseBadgeNftData[];
          otherNfts.push(...nfts);
        } else {
          const nfts = (await fetchHoldNfts(id)) as NftData[];
          otherNfts.push(...nfts);
        }
      })
    );
    // 最新順にソート
    otherNfts.sort((a, b) => {
      return (
        b.acquisition_time.toDate().getTime() -
        a.acquisition_time.toDate().getTime()
      );
    });
    setOtherNfts(otherNfts);
  };

  // 初期化処理。NFTのデータを取得
  useEffect(() => {
    if (!user) return;

    loadNekos();
    loadOtherNfts();
  }, [user]);

  // NFTのデータを更新
  // TODO: 引き換え処理のレスポンスでurlを返してもらう
  useEffect(() => {
    if (!user) return;

    if (shouldUpdate) {
      loadNekos();
      loadOtherNfts();
      setShouldUpdate(false);
    }
  }, [shouldUpdate]);

  const holdNftContextValue = useMemo<HoldNftsContextType>(
    () => ({
      nekoNfts: {
        current: nekoNfts,
        set: setNekoNfts,
      },
      otherNfts: {
        current: otherNfts,
        set: setOtherNfts,
      },
      shouldUpdate: {
        current: shouldUpdate,
        set: setShouldUpdate,
      },
      viewingSrc: {
        current: viewingSrc,
        set: setViewingSrc,
      },
    }),
    [
      nekoNfts,
      otherNfts,
      shouldUpdate,
      viewingSrc,
      setNekoNfts,
      setOtherNfts,
      setShouldUpdate,
      setViewingSrc,
    ]
  );

  return (
    <HoldNftsContext.Provider value={holdNftContextValue}>
      {children}
    </HoldNftsContext.Provider>
  );
};

export const useHoldNfts = () => useContext(HoldNftsContext);
