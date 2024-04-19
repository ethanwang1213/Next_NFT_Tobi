import { useAuth } from "contexts/AdminAuthProvider";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Loading from "ui/atoms/Loading";

const Index = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user.hasBusinessAccount) {
      router.push("/items");
    } else {
      router.push("/apply");
    }
  }, [router, user]);

  return (
    <div className={"h-[100dvh] flex justify-center"}>
      <Loading />
    </div>
  );
};

export default Index;
