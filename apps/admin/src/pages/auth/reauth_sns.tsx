import { useAuth } from "contexts/AdminAuthProvider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isProviderId, ProviderId } from "types/adminTypes";
import Reauth from "ui/templates/admin/ReauthSns";

const ReauthSns = () => {
  const { setReauthStatus } = useAuth();
  const [providerId, setProviderId] = useState<ProviderId | null>(null);
  const router = useRouter();

  useEffect(() => {
    const param = router.query.providerId;
    if (!param || typeof param !== "string") {
      router.push("/");
      return;
    }

    if (!isProviderId(param)) {
      router.push("/");
      return;
    }
    setProviderId(param);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickBack = () => {
    router.push("/auth/sns_account");
  };

  const handleClickConnect = async () => {
    setReauthStatus({
      [ProviderId.GOOGLE]: providerId === ProviderId.GOOGLE,
      [ProviderId.APPLE]: providerId === ProviderId.APPLE,
    });
    router.push("/auth/sns_account");
  };

  return (
    <Reauth
      providerId={providerId}
      onClickBack={onClickBack}
      onClickNext={handleClickConnect}
    />
  );
};

export default ReauthSns;
