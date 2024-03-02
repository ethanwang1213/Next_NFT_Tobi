import { useAuth } from "contexts/AdminAuthProvider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FlowAgreementWithSnsAccount from "ui/templates/admin/FlowAgreementWithSnsAccount";
import FlowRegister from "ui/templates/admin/FlowRegister";

const SnsAuth = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [flowAccountRegistered, setFlowAccountRegistered] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/signin");
    } else if (user.registeredFlowAccount) {
      router.push("/");
    }
  }, [router, user]);

  const startRegistering = () => {
    setIsRegistering(true);
    const timer = setTimeout(() => {
      setFlowAccountRegistered(true);
    }, 3000);
    return () => clearTimeout(timer);
  };

  if (!user) {
    return <div>redirect to signin page</div>;
  }

  if (user.registeredFlowAccount) {
    return <div>redirect to top page</div>;
  } else if (isRegistering) {
    return <FlowRegister registered={flowAccountRegistered} />;
  } else {
    return (
      <FlowAgreementWithSnsAccount
        user={user}
        onClickRegister={startRegistering}
      />
    );
  }
};

export default SnsAuth;
