import { useEffect } from "react";
import { useRouter } from "next/router";
import { createUser } from "@/firebase/firestore";
import { useAuth } from "@/contexts/AuthProvider";
import useSuccessDiscordOAuth from "@/hooks/useSuccessDiscordOAuth";

const Discord = () => {
  const auth = useAuth();
  const router = useRouter();
  const query = router.query;
  const { updateOnSuccess } = useSuccessDiscordOAuth();

  useEffect(() => {
    if (!auth.user) return;

    const getUserdata = async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_DISCORD_OAUTH_USERDATA_API_URL
      );
      if (response.status == 200) {
        return await response.json();
      } else {
        return null;
      }
    };

    (async () => {
      if (router.isReady) {
        const code = query.code;
        if (!code) {
          // not found code error
          router.push("/");
          updateOnSuccess();
          return;
        }
        const userdata = await getUserdata();
        if (userdata) {
          const result = await createUser(auth.user.id, userdata.id);
          if (result) {
            // success
            router.push("/");
            // updateOnSuccess();
          } else {
            // firestore error
            router.push("/");
          }
        } else {
          // cant get discord user data error
          router.push("/");
        }
      }
    })();
  }, [auth, query, router]);

  return (
    <div className={"flex justify-center items-center"}>
      <span>Loading...</span>
    </div>
  );
};

export default Discord;
