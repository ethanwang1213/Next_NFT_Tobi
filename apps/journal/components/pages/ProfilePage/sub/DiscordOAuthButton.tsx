import { useAuth } from "@/contexts/AuthProvider";
import { getAuth } from "@firebase/auth";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * Discordコミュニティ参加のための認証ボタン
 * @returns
 */
const DiscordOAuthButton: React.FC = () => {
  const auth = getAuth();
  const { user } = useAuth();
  const [discordId, setDiscordId] = useState<string | null>();

  useEffect(() => {
    if (auth.currentUser) {
      const discord = user.discord;
      if (discord) {
        setDiscordId(discord);
      }
    }
  }, [auth.currentUser, user]);

  const createButton = useCallback(
    (href: string, text: string) => (
      <a
        href={href}
        className="btn btn-accent bg-transparent hover:bg-accent/60 border-none btn-circle sm:btn-lg w-[64%] sm:w-[70%] relative overflow-hidden shadow-lg drop-shadow-[0_10px_6px_rgba(117,58,0,0.6)]"
      >
        <div className="bg-accent/90 rounded-full blur-[2px] w-full h-full absolute"></div>
        <div className="text-white absolute pointer-events-none flex">
          <FontAwesomeIcon
            icon={faDiscord}
            size="2x"
            className="mr-2 h-[40px]"
          />
          <p className="grid content-center">{text}</p>
        </div>
      </a>
    ),
    []
  );

  return (
    <>
      {discordId
        ? createButton(
            process.env.NEXT_PUBLIC_DISCORD_COMMUNITY_INVITE_URL!,
            "コミュニティに参加"
          )
        : createButton(
            process.env.NEXT_PUBLIC_DISCORD_OAUTH_URL!,
            "TOBIRA POLISへ"
          )}
    </>
  );
};

export default DiscordOAuthButton;
