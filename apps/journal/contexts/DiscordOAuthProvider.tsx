import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "contexts/journal-AuthProvider";
import { useHoldNfts } from "./HoldNftsProvider";
import useCommunityData from "@/hooks/useCommunityData";
import { HouseData } from "types/journal-types";

type Props = {
  children: React.ReactNode;
};

export type DisplayMode = "NONE" | "OAUTH" | "JOIN" | "STAMP";

type ContextType = {
  displayMode: {
    current: DisplayMode;
    set: Dispatch<SetStateAction<DisplayMode>>;
  };
  houseData: HouseData;
  initContext: () => void;
};

const DiscordOAuthContext = createContext<ContextType>({} as ContextType);

/**
 * Discord認証ボタンの表示状態を管理するコンテキストプロバイダー
 *
 * Discord参加済みスタンプがDiscordOAuthButtonと別コンポーネント(SuccessDiscordStamp)で表示されるため
 * Contextで管理している
 * @param param0
 * @returns
 */
export const DiscordOAuthProvider: React.FC<Props> = ({ children }) => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>("NONE");
  const { user } = useAuth();
  const { nekoNfts } = useHoldNfts();
  const { loadHouseData } = useCommunityData();
  const [houseData, setHouseData] = useState<HouseData>(null);

  const initContext = () => {
    setDisplayMode("NONE");
    setHouseData(null);
  };

  const execLoadHouseData = async () => {
    if (!user || !user.email) return;
    const houseData = await loadHouseData();
    setHouseData(houseData);
  };

  useEffect(() => {
    if (!user) return;
    execLoadHouseData();
  }, [user]);

  useEffect(() => {
    // コミュニティ参加の実装が動作しなかったとき用
    if (process.env.NEXT_PUBLIC_IS_DISCORD_BUTTON_HIDDEN === "true") {
      setDisplayMode("NONE");
      return;
    }

    if (!user || !displayMode || nekoNfts.current.length === 0) {
      // TOBIRA NEKOを持っていない場合
      setDisplayMode("NONE");
      return;
    } else {
      const discord = user?.discord;
      if (!discord) {
        // Discord連携していない場合
        setDisplayMode("OAUTH");
        return;
      } else {
        // Discord連携済みの場合
        if (!!houseData && houseData.joined) {
          setDisplayMode("STAMP");
        } else {
          setDisplayMode("JOIN");
        }
      }
    }
  }, [user, houseData, nekoNfts.current]);

  return (
    <DiscordOAuthContext.Provider
      value={{
        displayMode: { current: displayMode, set: setDisplayMode },
        houseData: houseData,
        initContext: initContext,
      }}
    >
      {children}
    </DiscordOAuthContext.Provider>
  );
};

export const useDiscordOAuth = () => useContext(DiscordOAuthContext);
