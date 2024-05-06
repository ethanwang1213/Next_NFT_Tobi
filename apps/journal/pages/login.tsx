import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  OAuthProvider,
  sendEmailVerification,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  emailLinkOnly,
  useAuth,
} from "journal-pkg/contexts/journal-AuthProvider";
import { auth } from "journal-pkg/fetchers/firebase/journal-client";
import { ErrorMessage, LoginFormType } from "journal-pkg/types/journal-types";
import AuthBoxLayout from "journal-pkg/ui/organisms/journal/AuthBoxLayout";
import AuthLayout from "journal-pkg/ui/organisms/journal/AuthLayout";
import AuthTemplate from "journal-pkg/ui/templates/AuthTemplate";
import ConfirmationSent from "journal-pkg/ui/templates/journal/ConfirmationSent";
import EmailAndPasswordSignIn from "journal-pkg/ui/templates/journal/EmailAndPasswordSignIn";
import EmailAndPasswordSignUp from "journal-pkg/ui/templates/journal/EmailAndPasswordSignUp";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AuthStates = {
  SignUp: 0,
  SignIn: 1,
  SignInWithEmailAndPassword: 2,
  SignUpWithEmailAndPassword: 3,
  PasswordReset: 4,
  ConfirmationEmailSent: 5,
  PasswordResetConfirmationEmailSent: 6,
} as const;
type AuthState = (typeof AuthStates)[keyof typeof AuthStates];

const Login = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [authError, setAuthError] = useState<ErrorMessage>(null);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [authState, setAuthState] = useState<AuthState>(AuthStates.SignIn);
  const [
    isRegisteringWithMailAndPassword,
    setIsRegisteringWithMailAndPassword,
  ] = useState(false);

  const startMailSignUp = async (data: LoginFormType) => {
    if (!data) {
      return;
    }

    const usedPasswordAuthenticationAlready = await usedPasswordAuthentication(
      data.email,
    );

    setEmail(data.email);
    if (usedPasswordAuthenticationAlready) {
      setAuthState(AuthStates.SignInWithEmailAndPassword);
    } else {
      setAuthState(AuthStates.SignUpWithEmailAndPassword);
    }
  };

  const startMailSignIn = async (data: LoginFormType) => {
    if (!data) {
      return;
    }

    const notSetPassword = await usedEmailLinkButNotSetPassword(data.email);

    if (notSetPassword) {
      sendEmailForPasswordReset(data.email, "journal/auth/password_reset");
    } else {
      setEmail(data.email);
      setAuthState(AuthStates.SignInWithEmailAndPassword);
    }
  };

  const usedPasswordAuthentication = async (email: string) => {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    return signInMethods.includes(
      EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
    );
  };

  const usedEmailLinkButNotSetPassword = async (email: string) => {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    return (
      signInMethods.includes(EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD) &&
      !signInMethods.includes(EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD)
    );
  };

  const withMailSignUp = async (email: string, password: string) => {
    setIsRegisteringWithMailAndPassword(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailOwnershipVerification("/journal");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setAuthState(AuthStates.SignInWithEmailAndPassword);
        return;
      }
      setAuthError({ code: error.code, message: error.message });
      setIsRegisteringWithMailAndPassword(false);
    }
  };

  const withMailSignIn = async (email: string, password: string) => {
    setIsEmailLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      if (!user.emailVerified) {
        await sendEmailOwnershipVerification("/journal");
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      setAuthError({ code: errorCode, message: errorMessage });
      setIsEmailLoading(false);
    }
  };

  // Googleアカウントでログインする関数
  const withGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      await router.push("/"); // ログイン後にリダイレクトするURLを指定
    } catch (error) {
      console.error("Googleログインに失敗しました。", error);
    }
  };

  const withApple = async () => {
    var provider = new OAuthProvider("apple.com");

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Appleログインに失敗しました。", error);
    }
  };

  const sendEmailOwnershipVerification = async (path: string) => {
    const actionCodeSettings = {
      url: `${window.location.origin}/${path}`,
      handleCodeInApp: true,
    };
    try {
      await sendEmailVerification(auth.currentUser, actionCodeSettings);
      setAuthState(AuthStates.ConfirmationEmailSent);
    } catch (error) {
      setAuthError({ code: error.code, message: error.message });
      setIsEmailLoading(false);
    }
  };

  const sendEmailForPasswordReset = async (email: string, path: string) => {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    if (signInMethods.length === 0) {
      setAuthError({
        code: "auth/user-not-found",
        message: "Tobiratoryアカウントが存在しません",
      });
      return;
    }

    const actionCodeSettings = {
      url: `${window.location.origin}/${path}`,
      handleCodeInApp: true,
    };
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      setAuthState(AuthStates.PasswordResetConfirmationEmailSent);
    } catch (error) {
      setAuthError({ code: error.code, message: error.message });
      setIsEmailLoading(false);
    }
  };

  const handleClickBack = (authState: AuthState) => {
    setIsRegisteringWithMailAndPassword(false);
    setIsEmailLoading(false);
    setAuthError(null);
    setAuthState(authState);
  };

  useEffect(() => {
    // When the user is no longer empty, it means that the onAuthStateChanged process has completed.
    if (user && auth.currentUser?.emailVerified) {
      emailLinkOnly(auth.currentUser.email).then((result) => {
        if (result) {
          auth.signOut();
        } else {
          router.push("/");
        }
      });
    }
  }, [user]);

  const AuthForm = () => {
    switch (authState) {
      case AuthStates.SignUp:
        return (
          <AuthTemplate
            loading={isEmailLoading}
            googleLabel={"Sign up with Google"}
            appleLabel={"Sign up with Apple"}
            mailLabel={"Sign up"}
            prompt={"Do you already have an account?　- SIGN IN"}
            setAuthState={() => setAuthState(AuthStates.SignIn)}
            withMail={startMailSignUp}
            withGoogle={withGoogle}
            withApple={withApple}
          />
        );
      case AuthStates.SignIn:
        return (
          <AuthTemplate
            loading={isEmailLoading}
            googleLabel={"Login in with Google"}
            appleLabel={"Login in with Apple"}
            mailLabel={"Login in"}
            prompt={"Dont’t have an account?　- SIGN UP"}
            setAuthState={() => setAuthState(AuthStates.SignUp)}
            withMail={startMailSignIn}
            withGoogle={withGoogle}
            withApple={withApple}
          />
        );
      case AuthStates.SignInWithEmailAndPassword:
        return (
          <AuthBoxLayout>
            <EmailAndPasswordSignIn
              email={email}
              loading={isEmailLoading}
              error={authError}
              onClickBack={() => handleClickBack(AuthStates.SignIn)}
              onClickPasswordReset={(email) =>
                sendEmailForPasswordReset(email, "journal/auth/password_reset")
              }
              withMailSignIn={withMailSignIn}
            />
          </AuthBoxLayout>
        );
      case AuthStates.SignUpWithEmailAndPassword:
        return (
          <AuthBoxLayout>
            <EmailAndPasswordSignUp
              title={"Password"}
              buttonText={"Sign up"}
              email={email}
              isSubmitting={isRegisteringWithMailAndPassword}
              isPasswordReset={false}
              authError={authError}
              onClickBack={() => handleClickBack(AuthStates.SignUp)}
              onClickSubmit={withMailSignUp}
            />
          </AuthBoxLayout>
        );
      case AuthStates.ConfirmationEmailSent:
        return (
          <AuthBoxLayout>
            <ConfirmationSent
              title={"Sent a confirmation email!"}
              fontSize={"small"}
              onClickBack={() => handleClickBack(AuthStates.SignIn)}
            />
          </AuthBoxLayout>
        );
      case AuthStates.PasswordResetConfirmationEmailSent:
        return (
          <AuthBoxLayout>
            <ConfirmationSent
              title={"Password Reset Confirmation Email Sent!"}
              fontSize={"tiny"}
              onClickBack={() => handleClickBack(AuthStates.SignIn)}
            />
          </AuthBoxLayout>
        );
    }
  };

  return <AuthLayout>{AuthForm()}</AuthLayout>;
};

export default Login;
