import { getMessages } from "admin/messages/messages";
import { applyActionCode, getAuth } from "firebase/auth";
import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import UpdateEmail from "./updateEmail";
import VerificationError from "./verificationError";
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
  const [error, setError] = useState(false);
  const [verified, setVerified] = useState(false);

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
          }
        }
        if (mode === "verifyAndChangeEmail" || mode === "recoverEmail" && oobCode) {
          const auth = getAuth();
          try {
            await applyActionCode(auth, oobCode as string);
            setVerified(true);
          } catch {
            setError(true);
          }
        }
      };

      verifyEmail();
    }
  }, [auth, mode, oobCode]);

  if (error) return <VerificationError />;
  if (mode === "verifyEmail" && oobCode && verified) return <VerifiedEmail />;
  if (mode === "recoverEmail" && oobCode && verified) return <UpdateEmail />;
  if (mode === "verifyAndChangeEmail" && oobCode && verified) {
   
    return <VerifyAndChangeEmail/>;
  }
};

export default AuthAction;