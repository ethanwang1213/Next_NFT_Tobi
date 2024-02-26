import { useAuth } from "contexts/AdminAuthProvider";
import router from "next/router";
import { useEffect, useState } from "react";
import FlowAgreement from "ui/templates/admin/FlowAgreement";
import FlowRegister from "ui/templates/admin/FlowRegister";

const Register = () => {
  const { user } = useAuth();
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
    return <FlowAgreement user={user} onClickRegister={startRegistering} />;
  }
};

export default Register;
