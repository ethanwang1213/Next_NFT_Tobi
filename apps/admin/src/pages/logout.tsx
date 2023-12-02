import { useAuth } from "contexts/admin-AuthProvider";
import { auth } from "fetchers/firebase/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Logout = () => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }

    const handleLogout = async () => {
      try {
        if (user?.email) {
          await auth.signOut();
        }
        await router.push("/login");
      } catch (error) {
        console.error("サインアウトに失敗しました。", error);
      }
    };

    handleLogout();
  }, [router, user]);

  return (
    <>
      <div className="flex items-center justify-center p-5 w-screen h-screen">
        <div className="relative aspect-square w-full max-w-[500px] flex items-center justify-center">
          <h1 className="text-4xl absolute text-neutral-content top-[75%]">
            Sign out...
          </h1>
        </div>
      </div>
    </>
  );
};

export default Logout;
