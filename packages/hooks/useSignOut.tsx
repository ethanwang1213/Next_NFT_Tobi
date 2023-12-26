import { useAuth } from "contexts/AdminAuthProvider";
import { auth } from "fetchers/firebase/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

const useSignOut = () => {
  const router = useRouter();
  const { user } = useAuth();
  const signInPath = "/signin";

  useEffect(() => {
    if (!user) {
      router.push(signInPath);
    }

    const signOut = async () => {
      try {
        if (user?.email) {
          await auth.signOut();
        }
        await router.push(signInPath);
      } catch (error) {
        console.error("サインアウトに失敗しました。", error);
      }
    };

    signOut();
  }, [router, user]);
};

export default useSignOut;
