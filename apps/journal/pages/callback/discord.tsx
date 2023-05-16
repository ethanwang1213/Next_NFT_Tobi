import { useEffect } from "react";
import { useRouter } from "next/router";
import { createUser } from "@/firebase/firestore";
import { useAuth } from "@/contexts/AuthProvider";

const Discord = () => {

  const auth = useAuth();
  const router = useRouter();
  const query = router.query;

  useEffect((() => {
    const getUserdata = async () => {
      const response = await fetch(process.env.DISCORD_OAUTH_API_URL);
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
          router.push("/");
          return;
        }
        const userdata = await getUserdata();
        if (userdata) {
          await createUser(auth.id, userdata.id);
        } else {
          router.push("/");
        }
      }
    })();
  }), [auth.id, query, router]);

  return (
    <div className={"flex justify-center items-center"}>
      <span>Loading...</span>
    </div>
  );
};

export default Discord;