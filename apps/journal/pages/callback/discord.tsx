import { auth } from "fetchers/firebase/journal-client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "contexts/journal-AuthProvider";
import useUpdateDiscordOAuthData from "@/hooks/useUpdateDiscordOAuthData";

/**
 * Discord認証のcallback用ページ
 * @returns
 */
const Discord = () => {
  const { user } = useAuth();
  const router = useRouter();
  const query = router.query;
  const { updateDiscordOAuthData } = useUpdateDiscordOAuthData();

  // Discordのユーザーデータを取得
  const getDiscordUserId: (code: string) => Promise<string> = async (
    code: string
  ) => {
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
      const json = await response.json();
      return json.id;
    } else {
      return null;
    }
  };

  // callbackのqueryのcodeをもとにDiscordのユーザーidを取得し、dbに認証情報を書き込む
  useEffect(() => {
    if (process.env["NEXT_PUBLIC_DEBUG_MODE"] === "true") return;
    if (!user) return;

    // 非同期に処理を実行
    (async () => {
      if (!router.isReady) return;

      // queryよりcode取得
      const code = query.code;
      if (!code || typeof code !== "string") {
        // not found code error
        router.push("/");
        return;
      }

      // Discordのユーザーid取得
      const discordId = await getDiscordUserId(code);

      // dbへ書き込み
      if (discordId) {
        await updateDiscordOAuthData(discordId);
      }

      // topへリダイレクト
      router.push("/");
    })();
  }, [user, query, router]);

  // テスト：dbへの書き込み
  useEffect(() => {
    if (process.env["NEXT_PUBLIC_DEBUG_MODE"] === "false") return;
    if (!user || !router.isReady) return;

    (async () => {
      const mockId = "mockidxxxxxxxxxxxxxxxxxxxx";
      await updateDiscordOAuthData(mockId);
      router.push("/");
    })();
  }, [user, router]);

  return (
    <div className={"flex justify-center items-center"}>
      <span>Loading...</span>
    </div>
  );
};

export default Discord;
