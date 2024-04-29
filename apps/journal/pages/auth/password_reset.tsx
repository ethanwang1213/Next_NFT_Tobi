import {
  isSignInWithEmailLink,
  signInWithEmailLink,
  updatePassword,
} from "firebase/auth";
import { auth } from "journal-pkg/fetchers/firebase/journal-client";
import { ErrorMessage } from "journal-pkg/types/journal-types";
import AuthBoxLayout from "journal-pkg/ui/organisms/journal/AuthBoxLayout";
import AuthLayout from "journal-pkg/ui/organisms/journal/AuthLayout";
import EmailAndPasswordSignUp from "journal-pkg/ui/templates/journal/EmailAndPasswordSignUp";
import PasswordResetFinished from "journal-pkg/ui/templates/journal/PasswordResetFinished";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const PasswordReset = () => {
  const router = useRouter();
  const [emailLink, setEmailLink] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [updatedPassword, setUpdatedPassword] = useState(false);
  const [authError, setAuthError] = useState<ErrorMessage>(null);

  useEffect(() => {
    const curHref = window.location.href;
    if (!isSignInWithEmailLink(auth, curHref)) {
      router.push("/login");
      return;
    }
    setEmailLink(curHref);
  }, [router]);

  const resetPassword = async (email: string, password: string) => {
    setUpdatingPassword(true);
    setAuthError(null);
    try {
      const userCredential = await signInWithEmailLink(auth, email, emailLink);
      await updatePassword(userCredential.user, password);
      setUpdatedPassword(true);
      await auth.signOut();
    } catch (error) {
      console.error(error);
      setAuthError({ code: error.code, message: error.message });
      setUpdatingPassword(false);
    }
  };

  return (
    <AuthLayout>
      <AuthBoxLayout>
        {updatedPassword ? (
          <PasswordResetFinished />
        ) : (
          <EmailAndPasswordSignUp
            title={"Password Reset"}
            buttonText={"Done"}
            email={""}
            isSubmitting={updatingPassword}
            isPasswordReset={true}
            authError={authError}
            onClickSubmit={resetPassword}
          />
        )}
      </AuthBoxLayout>
    </AuthLayout>
  );
};

export default PasswordReset;
