import { useAuth } from "contexts/AdminAuthProvider";
import { useTobiratoryAndFlowAccountRegistration } from "fetchers/adminUserAccount";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Loading from "ui/atoms/Loading";
import FlowRegister from "ui/templates/admin/FlowRegister";

const EmailAuth = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [register, response, registering, error] =
    useTobiratoryAndFlowAccountRegistration();

  useEffect(() => {
    if (!user) {
      router.push("/authentication");
    } else if (user.registeredFlowAccount) {
      router.push("/");
    } else {
      register();
    }
  }, [router, user]);

  if (user?.registeredFlowAccount) {
    return <div>redirect to top page</div>;
  } else if (registering || response || error) {
    return (
      <FlowRegister
        registered={!!response}
        error={error}
        onClickRegister={register}
      />
    );
  } else {
    return (
      <div className={"h-[100dvh] flex justify-center"}>
        <Loading className={"loading-spinner text-info loading-md"} />
      </div>
    );
  }
};

export default EmailAuth;
