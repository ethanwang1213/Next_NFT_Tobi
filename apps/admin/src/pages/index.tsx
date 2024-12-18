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

    if (user.hasFlowAccount) {
      if (user.hasBusinessAccount === "exist") {
        router.push("/items");
      } else if (
        user.hasBusinessAccount === "reported" ||
        user.hasBusinessAccount === "freezed"
      ) {
        router.push("/apply/contentRepoted");
      } else if (
        user.hasBusinessAccount === "not-approved" ||
        user.hasBusinessAccount === "rejected"
      ) {
        router.push("/apply/contentApproval");
      } else {
        router.push("/apply");
      }
    } else {
      router.push("/auth/sns_auth");
    }
  }, [router, user]);

  return (
    <div className={"h-[100dvh] flex justify-center"}>
      <Loading />
    </div>
  );
};

export default Index;
