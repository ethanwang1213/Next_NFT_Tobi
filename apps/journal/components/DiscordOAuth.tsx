import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { getAuth } from "@firebase/auth";

const DiscordOAuth = () => {

  const auth = getAuth();
  const user = useAuth();
  const [discordId, setDiscordId] = useState<string | null>();

  useEffect(() => {
    if (auth.currentUser) {
      const discord = user.discord;
      if (discord) {
        setDiscordId(discord);
      }
    }
  }, [auth.currentUser, user]);

  return (
    <>
      { discordId ? (
        <a href={process.env.DISCORD_COMMUNITY_INVITE_URL}>
          コミュニティに参加
        </a>
      ) : (
        <a href={process.env.DISCORD_OAUTH_URL}>
          Discord 連携
        </a>
      ) }
    </>
  );
};

export default DiscordOAuth;