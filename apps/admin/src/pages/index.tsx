import { useAuth } from "contexts/admin-AuthProvider";
import { auth } from "fetchers/firebase/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Index = () => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!auth) return;
    if (process.env.NEXT_PUBLIC_DEBUG_MODE === "false" && !auth.currentUser) {
      router.push("/login");
    }
  }, [router, user]);

  return <div>Admin Page</div>;
};

export default Index;
