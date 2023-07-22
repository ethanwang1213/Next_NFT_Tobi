import { useEffect } from "react";
import { useRouter } from "next/router";
import { createUser } from "@/firebase/firestore";
import { useAuth } from "@/contexts/AuthProvider";
import useSuccessDiscordOAuth from "@/hooks/useSuccessDiscordOAuth";
import { auth } from "@/firebase/client";

const Discord = () => {
  const { user } = useAuth();
  const router = useRouter();
  const query = router.query;
  const { updateOnSuccess } = useSuccessDiscordOAuth();

  useEffect(() => {
    if (!user) return;

    const getUserdata = async (code: string) => {
      if (!auth.currentUser) return;

      const token = await auth.currentUser.getIdToken();
      const response = await fetch(
        `/backend/api/functions/discordOAuth?code=${code}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
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
        if (!code || typeof code !== "string") {
          // not found code error
          router.push("/");
          return;
        }
        const userdata = await getUserdata(code);
        if (userdata) {
          const result = await createUser(user.id, userdata.id);
          if (result) {
            // success
            router.push("/");
            updateOnSuccess(userdata.id);
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
  }, [user, query, router]);

  return (
    <div className={"flex justify-center items-center"}>
      <span>Loading...</span>
    </div>
  );
};

export default Discord;
