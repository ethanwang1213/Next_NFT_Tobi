import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { getAuth } from "@firebase/auth";

const DiscordOAuth = () => {

  const auth = getAuth();
  const userAuth = useAuth();
  const [discordId, setDiscordId] = useState<string | null>();

  useEffect(() => {
    if (auth.currentUser) {
      const discord = userAuth.user.discord;
      if (discord) {
        setDiscordId(discord);
      }
    }
  }, [auth.currentUser, userAuth.user.discord]);

  return (
    <>
      { discordId ? (
        <a href={process.env.NEXT_PUBLIC_DISCORD_COMMUNITY_INVITE_URL}>
          コミュニティに参加
        </a>
      ) : (
        <a href={process.env.NEXT_PUBLIC_DISCORD_OAUTH_URL}>
          Discord 連携
        </a>
      ) }
    </>
  );
};

export default DiscordOAuth;