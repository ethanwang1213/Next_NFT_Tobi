import { getMessages } from "admin/messages/messages";
import { auth } from "fetchers/firebase/client";
import {
  applyActionCode,
  checkActionCode,
  verifyPasswordResetCode,
} from "firebase/auth";
import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getNormalLocale, Locale } from "types/localeTypes";
import Loading from "ui/atoms/Loading";
import PasswordReset from "ui/templates/admin/auth_action/password_reset";
import UpdateEmail from "ui/templates/admin/auth_action/updateEmail";
import VerificationError from "ui/templates/admin/auth_action/verificationError";
import VerifiedEmail from "ui/templates/admin/auth_action/verified_email";
import VerifyAndChangeEmail from "ui/templates/admin/auth_action/verifyAndChangeEmail";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}

type QueryParams = {
  oobCode: string | null;
  mode: string | null;
  lang: Locale | null;
};

const AuthAction = () => {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [restoredEmail, setRestoredEmail] = useState<string | null>(null);
  const [params, setParams] = useState<QueryParams>({
    oobCode: null,
    mode: null,
    lang: null,
  });

  useEffect(() => {
    if (!params.lang) return;

    router.push(router.pathname, router.asPath, { locale: params.lang });
  }, [params.lang]);

  useEffect(() => {
    if (!router.isReady || params.oobCode) {
      return;
    }

    if (!router.query.oobCode) {
      setError(true);
      setLoading(false);
      return;
    }

    const locale = getNormalLocale(getSingleValue(router.query.lang));
    setParams({
      oobCode: getSingleValue(router.query.oobCode),
      mode: getSingleValue(router.query.mode),
      lang: locale,
    });
  }, [router.isReady, router.query]);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (params.mode === "resetPassword") {
          const email = await verifyPasswordResetCode(auth, params.oobCode);
          setRestoredEmail(email);
          setVerified(true);
        } else if (params.mode === "verifyEmail") {
          await applyActionCode(auth, params.oobCode);
          await auth.currentUser?.reload();
          setVerified(true);
        } else if (
          params.mode === "verifyAndChangeEmail" ||
          params.mode === "recoverEmail"
        ) {
          const actionCodeInfo = await checkActionCode(auth, params.oobCode);
          setRestoredEmail(actionCodeInfo.data.email);
          await applyActionCode(auth, params.oobCode);
          setVerified(true);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (!params.oobCode) {
      return;
    } else {
      verifyEmail();
    }
  }, [auth, params.mode, params.oobCode]);

  const getSingleValue = (value: string | string[] | null) => {
    if (Array.isArray(value)) {
      return value[0];
    }
    return value;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading className="text-info" />
      </div>
    );
  }

  if (error) return <VerificationError />;

  if (verified) {
    if (params.mode === "resetPassword") {
      return <PasswordReset email={restoredEmail} oobCode={params.oobCode} />;
    } else if (params.mode === "verifyEmail") {
      return <VerifiedEmail />;
    } else if (params.mode === "recoverEmail") {
      return (
        <UpdateEmail
          email={restoredEmail}
          oobCode={params.oobCode}
          locale={params.lang}
        />
      );
    } else if (params.mode === "verifyAndChangeEmail") {
      return <VerifyAndChangeEmail restoredEmail={restoredEmail} />;
    }
  }
  return <VerificationError />;
};

export default AuthAction;
