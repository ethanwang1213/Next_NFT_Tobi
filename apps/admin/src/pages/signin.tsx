import { auth } from "fetchers/firebase/client";
import {
  GoogleAuthProvider,
  OAuthProvider,
  sendSignInLinkToEmail,
  signInWithPopup,
} from "firebase/auth";
import useAuthState from "hooks/useAuthState";
import { useRef, useState } from "react";
import SignIn, { LoginFormType } from "ui/templates/SignIn";

const Signin = () => {
  const emailModalRef = useRef<HTMLDialogElement>(null);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  useAuthState();

  // TODO: メールアドレスを使ってサインインする流れが変更になったので、後で修正する
  const signIn = (data: LoginFormType) => {
    if (!data) {
      return;
    }

    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: `${window.location.origin}/admin/email/verify`,
      // This must be true.
      handleCodeInApp: true,
    };
    setIsEmailLoading(true);
    sendSignInLinkToEmail(auth, data.email, actionCodeSettings)
      .then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem("emailForSignIn", data.email);
        emailModalRef.current.showModal();
        setIsEmailLoading(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("code: ", errorCode, ": ", errorMessage);
        setIsEmailLoading(false);
      });
  };

  const withGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Googleサインインに失敗しました。", error);
    }
  };

  const withApple = async () => {
    const provider = new OAuthProvider("apple.com");

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Appleサインインに失敗しました。", error);
    }
  };

  return (
    <SignIn
      loading={isEmailLoading}
      dialogRef={emailModalRef}
      signIn={signIn}
      withGoogle={withGoogle}
      withApple={withApple}
    />
  );
};

export default Signin;
