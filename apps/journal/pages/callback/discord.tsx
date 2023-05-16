import { useEffect } from "react";
import { useRouter } from "next/router";

const Discord = () => {

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

    if (router.isReady) {
      const code = query.code;
      if (!code) {
        router.replace("/");
        return;
      }
      const userdata = getUserdata();
      if (userdata) {
        // firestore
      } else {
        router.replace("/");
      }
    }
  }), [query, router]);

  return (
    <div className={"flex justify-center items-center"}>
      <span>Loading...</span>
    </div>
  );
};

export default Discord;