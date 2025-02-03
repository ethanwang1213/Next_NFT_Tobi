import { getMessages } from "admin/messages/messages";
import {
  hasSnsAccountForEmail,
  PASSWORD_RESET_PATH,
  useAuth,
} from "contexts/AdminAuthProvider";
import { auth } from "fetchers/firebase/client";
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
import { GetStaticPropsContext } from "next";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { ErrorMessage } from "types/adminTypes";
import { getPathWithLocale, LocalePlaceholder } from "types/localeTypes";
import FullScreenLoading from "ui/molecules/FullScreenLoading";
import ConfirmationSent from "ui/templates/admin/ConfirmationSent";
import EmailAndPasswordSignIn from "ui/templates/admin/EmailAndPasswordSignIn";
import FlowAgreementWithEmailAndPassword, {
  PageType,
} from "ui/templates/admin/FlowAgreementWithEmailAndPassword";
import SnsSignIn from "ui/templates/admin/SnsSignIn";
import AuthTemplate, { LoginFormType } from "ui/templates/AuthTemplate";

const AuthStates = {
  SignUp: 0,
  SignIn: 1,
  SignInWithEmailAndPassword: 2,
  SignUpWithEmailAndPassword: 3,
  SignInWithSnsAccount: 4,
  PasswordReset: 5,
  EmailSent: 6,
} as const;
type AuthState = (typeof AuthStates)[keyof typeof AuthStates];

const Authentication = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [authError, setAuthError] = useState<ErrorMessage>(null);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const hasRedirected = useRef(false);
  const [authState, setAuthState] = useState<AuthState>(AuthStates.SignIn);
  const [
    isRegisteringWithMailAndPassword,
    setIsRegisteringWithMailAndPassword,
  ] = useState(false);
  const t = useTranslations("LogInSignUp");
  const locale = useLocale();

  useEffect(() => {
    if (auth.currentUser) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user && !hasRedirected.current) {
      hasRedirected.current = true;
      if (user.hasBusinessAccount === "exist") {
        router.push("/items");
      } else if (
        user.hasBusinessAccount === "reported" ||
        user.hasBusinessAccount === "freezed"
      ) {
        router.push("/apply/contentRepoted");
      } else if (user.hasBusinessAccount === "not-approved") {
        router.push("/apply/contentApproval");
      } else if (user.hasBusinessAccount === "rejected") {
        router.push("/apply/contentRejected");
      } else {
        router.push("/apply");
      }
    }
  }, [user, router]);

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
      sendEmailForPasswordReset(data.email, PASSWORD_RESET_PATH);
    } else if (hasSnsAccountForEmail(data.email)) {
      setEmail(data.email);
      setAuthState(AuthStates.SignInWithSnsAccount);
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
      await sendEmailOwnershipVerification(
        `admin/${LocalePlaceholder}/auth/email_auth`,
      );
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
        await sendEmailOwnershipVerification(
          `admin/${LocalePlaceholder}/auth/sns_auth`,
        );
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      setAuthError({ code: errorCode, message: errorMessage });
      setIsEmailLoading(false);
    }
  };

  const withGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      setIsLoading(true);
    } catch (error) {
      console.error("Googleログインに失敗しました。", error);
    }
  };

  const withApple = async () => {
    const provider = new OAuthProvider("apple.com");

    try {
      await signInWithPopup(auth, provider);
      setIsLoading(true);
    } catch (error) {
      console.error("Appleログインに失敗しました。", error);
    }
  };

  const sendEmailOwnershipVerification = async (path: string) => {
    const newPath = getPathWithLocale(locale, path);
    const actionCodeSettings = {
      url: `${window.location.origin}/${newPath}`,
      handleCodeInApp: true,
    };
    auth.languageCode = locale;
    try {
      await sendEmailVerification(auth.currentUser, actionCodeSettings);
      setAuthState(AuthStates.EmailSent);
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

    const newPath = getPathWithLocale(locale, path);
    const actionCodeSettings = {
      url: `${window.location.origin}/${newPath}`,
      handleCodeInApp: true,
    };
    auth.languageCode = locale;
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      setAuthState(AuthStates.EmailSent);
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

  switch (authState) {
    case AuthStates.SignUp:
      return (
        <>
          <AuthTemplate
            loading={isEmailLoading}
            googleLabel={t("SignUpWithGoogle")}
            appleLabel={t("SignUpWithApple")}
            mailLabel={t("SignUp")}
            prompt={t("AlreadyHaveAccount")}
            setAuthState={() => setAuthState(AuthStates.SignIn)}
            withMail={startMailSignUp}
            withGoogle={withGoogle}
            withApple={withApple}
          />
          <FullScreenLoading isOpen={isLoading} />
        </>
      );
    case AuthStates.SignIn:
      return (
        <>
          <AuthTemplate
            loading={isEmailLoading}
            googleLabel={t("LogInWithGoogle")}
            appleLabel={t("LogInWithApple")}
            mailLabel={t("LogIn")}
            prompt={t("NoAccountSignUp")}
            setAuthState={() => setAuthState(AuthStates.SignUp)}
            withMail={startMailSignIn}
            withGoogle={withGoogle}
            withApple={withApple}
          />
          <FullScreenLoading isOpen={isLoading} />
        </>
      );
    case AuthStates.SignUpWithEmailAndPassword:
      return (
        <FlowAgreementWithEmailAndPassword
          title={""}
          buttonText={t("Register")}
          email={email}
          isSubmitting={isRegisteringWithMailAndPassword}
          pageType={PageType.FlowAccountCreation}
          authError={authError}
          onClickBack={() => handleClickBack(AuthStates.SignUp)}
          onClickSubmit={withMailSignUp}
        />
      );
    case AuthStates.SignInWithEmailAndPassword:
      return (
        <EmailAndPasswordSignIn
          email={email}
          loading={isEmailLoading}
          error={authError}
          onClickBack={() => handleClickBack(AuthStates.SignIn)}
          onClickPasswordReset={(email) =>
            sendEmailForPasswordReset(email, PASSWORD_RESET_PATH)
          }
          withMailSignIn={withMailSignIn}
        />
      );
    case AuthStates.SignInWithSnsAccount:
      return (
        <SnsSignIn
          email={email}
          loading={isLoading}
          googleLabel={t("LogInWithGoogle")}
          appleLabel={t("LogInWithApple")}
          withGoogle={withGoogle}
          withApple={withApple}
          onClickBack={() => handleClickBack(AuthStates.SignIn)}
        />
      );
    case AuthStates.EmailSent:
      return (
        <ConfirmationSent
          onClickBack={() => handleClickBack(AuthStates.SignIn)}
        />
      );
  }
};

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}

export default Authentication;
