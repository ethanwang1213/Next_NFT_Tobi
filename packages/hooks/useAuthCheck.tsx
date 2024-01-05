import { auth } from "fetchers/firebase/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useAuthCheck = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DEBUG_MODE === "false" && !auth.currentUser) {
      router.push("/signin");
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  return { isAuthenticated };
};

export default useAuthCheck;
