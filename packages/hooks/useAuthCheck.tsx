import { auth } from "fetchers/firebase/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

const useAuthCheck = () => {
  const router = useRouter();
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DEBUG_MODE === "false" && !auth?.currentUser) {
      router.push("/signin");
    }
  }, [router]);
};

export default useAuthCheck;
