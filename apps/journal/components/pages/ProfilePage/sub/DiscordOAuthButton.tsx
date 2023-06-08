import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useContext } from "react";
import { useDebug } from "@/contexts/DebugProvider";
import { useDiscordOAuth } from "@/contexts/DiscordOAuthProvider";
import { BookContext } from "@/contexts/BookContextProvider";

/**
 * Discordコミュニティ参加のための認証ボタン
 * スタンプの表示はprofileページ内だとDOMの構造的に問題があるので、
 * 別のコンポーネント(SuccessDiscordStamp)で表示している
 * @returns
 */
const DiscordOAuthButton: React.FC = () => {
  const { displayMode } = useDiscordOAuth();
  const bookContext = useContext(BookContext);
  const pageNo = bookContext.pageNo.current;
  const { profilePage } = bookContext.bookIndex;

  const createButton = useCallback(
    (href: string, text: string) => (
      <a
        href={href}
        className="
          btn btn-accent bg-transparent hover:bg-accent/60 
          border-none btn-circle h-[56px] sm:btn-lg
          w-full max-w-[300px] sm:w-[70%] sm:max-w-[70%] relative
          overflow-hidden shadow-lg drop-shadow-[0_10px_6px_rgba(117,58,0,0.6)]
          pointer-events-auto"
      >
        <div className="bg-accent/90 rounded-full blur-[2px] w-full h-full absolute"></div>
        <div className="text-white absolute pointer-events-none flex px-2">
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

  const debug = useDebug();
  const { current: debugButtonMode } = debug.debugDiscordButtonMode;

  if (pageNo !== profilePage.start) return <></>;

  return (
    <>
      {process.env["NEXT_PUBLIC_DEBUG_MODE"] === "true" ? (
        <>
          {debugButtonMode === "NONE" && <></>}
          {debugButtonMode === "OAUTH" &&
            createButton(
              process.env["NEXT_PUBLIC_DISCORD_OAUTH_URL"]!,
              "TOBIRAPOLISへ"
            )}
          {debugButtonMode === "JOIN" &&
            createButton(
              process.env["NEXT_PUBLIC_DISCORD_COMMUNITY_INVITE_URL"]!,
              "コミュニティに参加"
            )}
        </>
      ) : (
        <>
          {displayMode.current === "NONE" && <></>}
          {displayMode.current === "OAUTH" &&
            createButton(
              process.env["NEXT_PUBLIC_DISCORD_OAUTH_URL"]!,
              "TOBIRAPOLISへ"
            )}
          {displayMode.current === "JOIN" &&
            createButton(
              process.env["NEXT_PUBLIC_DISCORD_COMMUNITY_INVITE_URL"]!,
              "コミュニティに参加"
            )}
        </>
      )}
    </>
  );
};

export default DiscordOAuthButton;
