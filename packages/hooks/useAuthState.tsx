import { auth } from "fetchers/firebase/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

const useAuthState = () => {
  const router = useRouter();
  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      if (user?.email) {
        console.log(`${user.email} としてログイン中です。`);
        router.push("/");
      }
    });
  }, [router]);
};

export default useAuthState;
