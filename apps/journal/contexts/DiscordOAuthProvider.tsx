import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthProvider";
import { useHoldNFTs } from "./HoldNFTsProvider";

type Props = {
  children: React.ReactNode;
};

export type DisplayMode = "NONE" | "OAUTH" | "JOIN" | "STAMP";

type ContextType = {
  displayMode: {
    current: DisplayMode;
    set: Dispatch<SetStateAction<DisplayMode>>;
  };
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
  const { nekoNFTs } = useHoldNFTs();

  useEffect(() => {
    // コミュニティ参加の実装が完了するまではDiscordOAuthButtonを非表示にする
    if (process.env.NEXT_PUBLIC_IS_DISCORD_BUTTON_HIDDEN === "true") {
      setDisplayMode("NONE");
      return;
    }

    if (!user || !displayMode || nekoNFTs.current.length === 0) {
      // TOBIRA NEKOを持っていない場合
      setDisplayMode("NONE");
      return;
    } else {
      const discord = user.discord;
      if (!discord) {
        // Discord連携していない場合
        setDisplayMode("OAUTH");
        return;
      } else {
        // Discord連携済みの場合
        setDisplayMode("JOIN");
        if (user.community) {
          const joined = user.community.joined;
          if (joined) {
            // さらにサーバー参加済みの場合
            setDisplayMode("STAMP");
            return;
          }
        }
      }
    }
  }, [user, displayMode, nekoNFTs.current]);

  return (
    <DiscordOAuthContext.Provider
      value={{ displayMode: { current: displayMode, set: setDisplayMode } }}
    >
      {children}
    </DiscordOAuthContext.Provider>
  );
};

export const useDiscordOAuth = () => useContext(DiscordOAuthContext);
