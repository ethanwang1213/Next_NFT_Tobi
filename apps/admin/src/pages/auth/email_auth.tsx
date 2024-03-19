import { useAuth } from "contexts/AdminAuthProvider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "ui/atoms/Loading";
import FlowRegister from "ui/templates/admin/FlowRegister";

const EmailAuth = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [flowAccountRegistered, setFlowAccountRegistered] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/authentication");
      return;
    }

    if (user?.registeredFlowAccount) {
      router.push("/");
      return;
    }

    startRegistering();
  }, [router, user]);

  const startRegistering = () => {
    // TODO: Register Tobiratory account and Flow account
    setIsRegistering(true);
    const timer = setTimeout(() => {
      setFlowAccountRegistered(true);
    }, 3000);
    return () => clearTimeout(timer);
  };

  if (user?.registeredFlowAccount) {
    return <div>redirect to top page</div>;
  } else if (isRegistering) {
    return <FlowRegister registered={flowAccountRegistered} />;
  } else {
    return (
      <div className={"h-[100dvh] flex justify-center"}>
        <Loading className={"loading-spinner text-info loading-md"} />
      </div>
    );
  }
};

export default EmailAuth;
