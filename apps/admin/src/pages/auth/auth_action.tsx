import { getMessages } from "admin/messages/messages";
import { applyActionCode, getAuth } from "firebase/auth";
import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import UpdateEmail from "./updateEmail";
import VerifiedEmail from "./verified_email";
import VerifyAndChangeEmail from "./verifyAndChangeEmail";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}

const AuthAction = () => {
  const auth = getAuth();
  const router = useRouter();
  const { oobCode, mode } = router.query;
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(true);

  if (mode === "verifyEmail") {
    const handleVerifyEmail = async () => {
      if (!oobCode) {
        setError("Invalid verification link.");
        setVerified(false);
        return;
      }
      try {
        await applyActionCode(auth, oobCode as string);
        await auth.currentUser?.reload();
        window.location.href = "/admin/auth/email_auth";
      } catch (err) {
        setVerified(false);
        setError("Verification failed. The link may have expired.");
      }
    };
    return (
      <VerifiedEmail
        verified={verified}
        error={error}
        onVerify={handleVerifyEmail}
      />
    );
  }

  if (mode === "recoverEmail") {
    const handleVerifyEmail = async () => {
      if (!oobCode) {
        setError("Invalid verification link.");
        setVerified(false);
        return;
      }
      try {
        await applyActionCode(auth, oobCode as string);
        await auth.currentUser?.reload();
      } catch (err) {
        setVerified(false);
        setError("Verification failed. The link may have expired.");
      }
      window.location.href = "/admin/authentication";
    };
    return <UpdateEmail onVerify={handleVerifyEmail} />;
  }
  if (mode === "verifyAndChangeEmail") {
    const handleVerifyAndChangeEmail = async () => {
      if (!oobCode) {
        setError("Invalid verification link.");
        setVerified(false);
        return;
      }
      try {
        await applyActionCode(auth, oobCode as string);
        await auth.currentUser?.reload();
      } catch (err) {
        setVerified(false);
        setError("Verification failed. The link may have expired.");
      }
      window.location.href = "/admin/apply";
    };
    return (
      <VerifyAndChangeEmail
        verified={verified}
        error={error}
        onVerify={handleVerifyAndChangeEmail}
      />
    );
  }
};

export default AuthAction;
