import { useAuth } from "@/contexts/AuthProvider";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import StampIcon from "@/public/images/icon/stamp_TOBIRAPOLIS.svg";
import { useHoldNFTs } from "@/contexts/HoldNFTsProvider";

type DisplayMode = "NONE" | "OAUTH" | "JOIN" | "STAMP";

/**
 * Discordコミュニティ参加のための認証ボタン
 * @returns
 */
const DiscordOAuthButton: React.FC = () => {
  const { user } = useAuth();
  const { nekoNFTs } = useHoldNFTs();

  const [displayMode, setDisplayMode] = useState<DisplayMode>("NONE");

  useEffect(() => {
    if (!user || nekoNFTs.current.length < 0) {
      // TOBIRA NEKOを持っていない場合
      setDisplayMode("NONE");
      return;
    } else {
      const discord = user.discord;
      if (!discord) {
        // Discord連携していない場合
        setDisplayMode("OAUTH");
      } else {
        // Discord連携済みの場合
        setDisplayMode("JOIN");
        if (user.community) {
          const joined = user.community.joined;
          if (joined) {
            // さらにサーバー参加済みの場合
            setDisplayMode("STAMP");
          }
        }
      }
    }
  }, [user]);

  const createButton = useCallback(
    (href: string, text: string) => (
      <a
        href={href}
        className="
          btn btn-accent bg-transparent hover:bg-accent/60 
          border-none btn-circle sm:btn-lg 
          w-[64%] sm:w-[70%] relative 
          overflow-hidden shadow-lg drop-shadow-[0_10px_6px_rgba(117,58,0,0.6)]"
      >
        <div className="bg-accent/90 rounded-full blur-[2px] w-full h-full absolute"></div>
        <div className="text-white absolute pointer-events-none flex">
          <FontAwesomeIcon
            icon={faDiscord}
            size="2x"
            className="mr-2 h-[40px]"
          />
          <p className="grid content-center sm:text-[20px]">{text}</p>
        </div>
      </a>
    ),
    []
  );

  return (
    <>
      {displayMode === "NONE" && <></>}
      {displayMode === "OAUTH" &&
        createButton(
          process.env["NEXT_PUBLIC_DISCORD_OAUTH_URL"]!,
          "TOBIRA POLISへ"
        )}
      {displayMode === "JOIN" &&
        createButton(
          process.env["NEXT_PUBLIC_DISCORD_COMMUNITY_INVITE_URL"]!,
          "コミュニティに参加"
        )}
      {displayMode === "STAMP" && <StampIcon />}
    </>
  );
};

export default DiscordOAuthButton;
