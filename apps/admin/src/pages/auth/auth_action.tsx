import { getMessages } from "admin/messages/messages";
import { applyActionCode, checkActionCode, getAuth } from "firebase/auth";
import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "ui/atoms/Loading";
import UpdateEmail from "ui/templates/admin/auth_action/updateEmail";
import VerifyAndChangeEmail from "ui/templates/admin/auth_action/verifyAndChangeEmail";
import VerificationError from "./verificationError";
import VerifiedEmail from "./verified_email";

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
  const { oobCode, mode, lang, apiKey } = router.query;
  const [error, setError] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [restoredEmail, setRestoredEmail] = useState<string | null>(null);
  useEffect(() => {
    if (auth) {
      const verifyEmail = async () => {
        if (mode === "verifyEmail" && oobCode) {
          try {
            await applyActionCode(auth, oobCode as string);
            await auth.currentUser?.reload();
            setVerified(true);
          } catch {
            setError(true);
          } finally {
            setLoading(false);
          }
        }
        if (
          mode === "verifyAndChangeEmail" ||
          (mode === "recoverEmail" && oobCode)
        ) {
          const auth = getAuth();
          try {
            const actionCodeInfo = await checkActionCode(
              auth,
              oobCode as string,
            );
            setRestoredEmail(actionCodeInfo.data.email);
            await applyActionCode(auth, oobCode as string);
            setVerified(true);
          } catch {
            setError(true);
          } finally {
            setLoading(false);
          }
        }
      };
      verifyEmail();
    }
  }, [auth, mode, oobCode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading className="text-info" />
      </div>
    );
  }
  if (error) return <VerificationError />;
  if (mode === "verifyEmail" && oobCode && verified) return <VerifiedEmail />;
  if (mode === "recoverEmail" && oobCode && verified)
    return (
      <UpdateEmail
        restoredEmail={restoredEmail}
        oobCode={oobCode}
        lang={lang}
        apiKey={apiKey}
      />
    );
  if (mode === "verifyAndChangeEmail" && oobCode && verified) {
    return <VerifyAndChangeEmail restoredEmail={restoredEmail} />;
  }
  return <VerificationError />;
};

export default AuthAction;
