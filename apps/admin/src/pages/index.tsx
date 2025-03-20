import { getMessages } from "admin/messages/messages";
import { useAuth } from "contexts/AdminAuthProvider";
import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Loading from "ui/atoms/Loading";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}

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
        router.push("/apply/contentReported");
      } else if (user.hasBusinessAccount === "not-approved") {
        router.push("/apply/contentApproval");
      } else if (user.hasBusinessAccount === "rejected") {
        router.push("/apply/contentRejected");
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
