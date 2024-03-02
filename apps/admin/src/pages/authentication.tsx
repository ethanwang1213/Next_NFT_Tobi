import { auth } from "fetchers/firebase/client";
import {
  GoogleAuthProvider,
  OAuthProvider,
  sendSignInLinkToEmail,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import ConfirmationSent from "ui/templates/admin/ConfirmationSent";
import AuthTemplate, { LoginFormType } from "ui/templates/AuthTemplate";

const AuthStates = {
  SignUp: 0,
  SignIn: 1,
  MailSent: 2,
} as const;
type AuthState = (typeof AuthStates)[keyof typeof AuthStates];

const Authentication = () => {
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [authState, setAuthState] = useState<AuthState>(AuthStates.SignIn);

  // TODO: メールアドレスを使ってサインインする流れが変更になったので、後で修正する
  const withMail = (data: LoginFormType) => {
    if (!data) {
      return;
    }

    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: `${window.location.origin}/admin/auth/email_auth`,
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
        setAuthState(AuthStates.MailSent);
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

  switch (authState) {
    case AuthStates.SignUp:
      return (
        <AuthTemplate
          loading={isEmailLoading}
          googleLabel={"Googleでサインアップ"}
          appleLabel={"Appleでサインアップ"}
          mailLabel={"サインアップ"}
          prompt={"既にアカウントを持っていますか？ - サインイン"}
          setAuthState={() => setAuthState(AuthStates.SignIn)}
          withMail={withMail}
          withGoogle={withGoogle}
          withApple={withApple}
        />
      );
    case AuthStates.SignIn:
      return (
        <AuthTemplate
          loading={isEmailLoading}
          googleLabel={"Googleでサインイン"}
          appleLabel={"Appleでサインイン"}
          mailLabel={"サインイン"}
          prompt={"アカウントを持っていませんか？ - 新規登録"}
          setAuthState={() => setAuthState(AuthStates.SignUp)}
          withMail={withMail}
          withGoogle={withGoogle}
          withApple={withApple}
        />
      );
    case AuthStates.MailSent:
      return <ConfirmationSent />;
  }
};

export default Authentication;
