import { useAuth } from "contexts/AdminAuthProvider";
import { auth } from "fetchers/firebase/client";
import {
  isSignInWithEmailLink,
  signInWithEmailLink,
  updatePassword,
} from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ErrorMessage } from "types/adminTypes";
import FlowAgreementWithEmailAndPassword from "ui/templates/admin/FlowAgreementWithEmailAndPassword";

const PasswordReset = () => {
  const { user } = useAuth();
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
  }, []);

  const resetPassword = async (email: string, password: string) => {
    setUpdatingPassword(true);
    setAuthError(null);
    try {
      console.log(email);
      const userCredential = await signInWithEmailLink(auth, email, emailLink);
      console.log(userCredential);
      await updatePassword(userCredential.user, password);
      console.log("Password updated!");
      setUpdatedPassword(true);
      await auth.signOut();
    } catch (error) {
      console.error(error);
      setAuthError({ code: error.code, message: error.message });
      setUpdatingPassword(false);
    }
  };

  if (user?.registeredFlowAccount) {
    return <div>redirect to top page</div>;
  } else if (updatedPassword) {
    return (
      <div className="flex flex-col items-center justify-center w-[100dvw] p-8">
        <Image
          src={"/admin/images/tobiratory-logo.svg"}
          alt={"Tobiratory logo"}
          width={110}
          height={114}
        />
        <div className={"mt-[200px]"}>パスワードをリセットしました</div>
        <div>
          <button
            type={"button"}
            className={
              "btn-link font-medium text-[14px] text-primary mt-[20px]"
            }
            onClick={() => router.push("/authentication")}
          >
            認証画面へ
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <FlowAgreementWithEmailAndPassword
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
