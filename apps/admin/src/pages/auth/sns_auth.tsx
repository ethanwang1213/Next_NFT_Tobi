import { useAuth } from "contexts/AdminAuthProvider";
import { useTobiratoryAndFlowAccountRegistration } from "fetchers/adminUserAccount";
import { useRouter } from "next/router";
import { useEffect } from "react";
import FlowAgreementWithSnsAccount from "ui/templates/admin/FlowAgreementWithSnsAccount";
import FlowRegister from "ui/templates/admin/FlowRegister";

const SnsAuth = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [register, response, registering, error] =
    useTobiratoryAndFlowAccountRegistration();

  useEffect(() => {
    if (!user) {
      router.push("/authentication");
    } else if (user.registeredFlowAccount) {
      router.push("/");
    }
  }, [router, user]);

  if (!user) {
    return <div>redirect to signin page</div>;
  }

  if (user.registeredFlowAccount) {
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
      <FlowAgreementWithSnsAccount user={user} onClickRegister={register} />
    );
  }
};

export default SnsAuth;
