import {
  isSignInWithEmailLink,
  signInWithEmailLink,
  updatePassword,
} from "firebase/auth";
import { auth } from "journal-pkg/fetchers/firebase/journal-client";
import { ErrorMessage } from "journal-pkg/types/journal-types";
import EmailAndPasswordSignUp from "journal-pkg/ui/templates/journal/EmailAndPasswordSignUp";
import Image from "next/image";
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
      router.push("/authentication");
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

  if (updatedPassword) {
    return (
      <div className="flex flex-col items-center justify-center w-[100dvw] p-8">
        <Image
          src={"/journal/images/login/journal_book.svg"}
          alt={"Tobiratory logo"}
          width={296}
          height={230}
          className={"mt-[200px]"}
        />
        <div className={"mt-[40px]"}>パスワードをリセットしました</div>
        <div>
          <button
            type={"button"}
            className={
              "btn-link font-medium text-[14px] text-primary mt-[20px]"
            }
            onClick={() => router.push("/login")}
          >
            認証画面へ
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <EmailAndPasswordSignUp
        title={"パスワードリセット"}
        buttonText={"リセット"}
        email={""}
        isSubmitting={updatingPassword}
        isPasswordReset={true}
        authError={authError}
        onClickSubmit={resetPassword}
      />
    );
  }
};

export default PasswordReset;
