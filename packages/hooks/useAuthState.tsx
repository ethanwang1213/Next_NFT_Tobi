import { auth } from "fetchers/firebase/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

const useAuthState = () => {
  const router = useRouter();
  useEffect(() => {
    const handleRedirect = async () => {
      // ログイン状態の変化を監視
      auth.onAuthStateChanged(async (user) => {
        if (user?.email) {
          console.log(`${user.email} としてログイン中です。`);
          // サインイン済みの場合、リダイレクト処理を実行
          await router.push("/"); // リダイレクト先のURLを指定
        }
      });
    };
    void handleRedirect();
  }, [router]);
};

export default useAuthState;
