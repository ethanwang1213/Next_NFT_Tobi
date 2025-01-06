import {
  AuthProvider,
  GoogleAuthProvider,
  linkWithPopup,
  OAuthProvider,
} from "@firebase/auth";
import { auth } from "fetchers/firebase/client";
import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ErrorMessage, isProviderId, ProviderId } from "types/adminTypes";
import Reauth from "ui/templates/admin/ReauthPassword";
import { getMessages } from "admin/messages/messages";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}

const ReauthPassword = () => {
  const [provider, setProvider] = useState<AuthProvider | null>(null);
  const [error, setError] = useState<ErrorMessage | null>(null);
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

    const targetProvider = getProvider(param);
    if (!targetProvider) {
      router.push("/");
      return;
    }

    setProvider(targetProvider);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProvider = (providerId: ProviderId) => {
    switch (providerId) {
      case ProviderId.GOOGLE:
        return new GoogleAuthProvider();
      case ProviderId.APPLE:
        return new OAuthProvider(ProviderId.APPLE);
      default:
        return null;
    }
  };

  const onClickBack = () => {
    router.push("/auth/sns_account");
  };

  const handleClickConnect = async () => {
    try {
      await linkWithPopup(auth.currentUser, provider);
      router.push("/auth/sns_account");
    } catch (error) {
      setError(error);
    }
  };

  return (
    <Reauth
      onClickBack={onClickBack}
      onClickNext={handleClickConnect}
      error={error}
    />
  );
};

export default ReauthPassword;
