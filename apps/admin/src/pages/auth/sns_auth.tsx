import { getMessages } from "admin/messages/messages";
import { isFlowAccountProcessing, useAuth } from "contexts/AdminAuthProvider";
import { useTobiratoryAndFlowAccountRegistration } from "fetchers/adminUserAccount";
import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FlowAccountStatus } from "types/adminTypes";
import Loading from "ui/atoms/Loading";
import FlowAgreementWithSnsAccount from "ui/templates/admin/FlowAgreementWithSnsAccount";
import FlowRegister from "ui/templates/admin/FlowRegister";
export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}

const SnsAuth = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [register, response, registering, error, setError] =
    useTobiratoryAndFlowAccountRegistration();

  useEffect(() => {
    if (!user) {
      return;
    } else if (user.hasFlowAddress) {
      router.push("/");
    } else if (user.flowAccountStatus === FlowAccountStatus.Error) {
      setError(FlowAccountStatus.Error);
    } else if (
      ((user.hasTobiratoryAccount && !user.hasFlowAccount) ||
        isFlowAccountProcessing(user.flowAccountStatus)) &&
      !registering &&
      !response &&
      !error
    ) {
      // When the screen is reloaded during Flow account creation
      register();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, user]);

  if (!user || user.hasFlowAddress) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading className="text-info" />
      </div>
    );
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
