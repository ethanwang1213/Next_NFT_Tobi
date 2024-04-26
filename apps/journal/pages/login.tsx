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
import gsap from "gsap";
import { auth } from "journal-pkg/fetchers/firebase/journal-client";
import { ErrorMessage } from "journal-pkg/types/journal-types";
import AuthTemplate from "journal-pkg/ui/templates/AuthTemplate";
import ConfirmationSent from "journal-pkg/ui/templates/journal/ConfirmationSent";
import EmailAndPasswordSignIn from "journal-pkg/ui/templates/journal/EmailAndPasswordSignIn";
import EmailAndPasswordSignUp from "journal-pkg/ui/templates/journal/EmailAndPasswordSignUp";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

type LoginFormType = {
  email: string;
};

const AuthStates = {
  SignUp: 0,
  SignIn: 1,
  SignInWithEmailAndPassword: 2,
  SignUpWithEmailAndPassword: 3,
  PasswordReset: 4,
  EmailSent: 5,
} as const;
type AuthState = (typeof AuthStates)[keyof typeof AuthStates];

const Login = () => {
  const loginRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const arcRef1 = useRef<HTMLDivElement>(null);
  const arcRef2 = useRef<HTMLDivElement>(null);
  const arcRef3 = useRef<HTMLDivElement>(null);
  const logoMobileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [authError, setAuthError] = useState<ErrorMessage>(null);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [authState, setAuthState] = useState<AuthState>(AuthStates.SignIn);
  const [
    isRegisteringWithMailAndPassword,
    setIsRegisteringWithMailAndPassword,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    defaultValues: {
      email: "",
    },
  });

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
      await sendEmailOwnershipVerification("/");
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
        await sendEmailOwnershipVerification("/");
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

    const actionCodeSettings = {
      url: `${window.location.origin}/${path}`,
      handleCodeInApp: true,
    };
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
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

  useEffect(() => {
    // console.log(auth.currentUser);
    const handleRedirect = async () => {
      // ログイン状態の変化を監視
      auth.onAuthStateChanged(async (user) => {
        if (user && user.email) {
          console.log(`${user.email} としてログイン中です。`);
          if (user.emailVerified) {
            // ログイン済みの場合、リダイレクト処理を実行
            await router.push("/"); // リダイレクト先のURLを指定
          }
        }
      });
    };

    handleRedirect();
  }, []);

  useEffect(() => {
    gsap
      .timeline()
      .fromTo(
        loginRef.current,
        { top: "-100dvh", ease: "power4.inOut" },
        { top: 0, duration: 1.5 },
        "2",
      )
      .to(
        logoRef.current,
        { x: "-250px", ease: "power4.inOut", duration: 1.5 },
        "<",
      )
      .from(
        bookRef.current,
        { y: "14rem", ease: "power4.inOut", duration: 1.5 },
        "<",
      )
      .to(
        arcRef1.current,
        { left: "5dvw", top: "5dvh", ease: "power4.inOut", duration: 1.5 },
        "<",
      )
      .to(
        arcRef2.current,
        { top: "-2dvh", ease: "power4.inOut", duration: 1.5 },
        "<",
      )
      .to(
        arcRef3.current,
        { left: "-5dvw", ease: "power4.inOut", duration: 1.5 },
        "<",
      )
      .fromTo(
        logoMobileRef.current,
        { y: 0, maxHeight: "100%" },
        { y: "-40dvh", maxHeight: "15dvh" },
        "<",
      );
  }, []);

  const AuthForm = () => {
    switch (authState) {
      case AuthStates.SignUp:
        return (
          <AuthTemplate
            loading={isEmailLoading}
            googleLabel={"Sign up with Google"}
            appleLabel={"Sign up with Apple"}
            mailLabel={"Sign up"}
            prompt={"既にアカウントを持っていますか？ - サインイン"}
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
            prompt={"アカウントを持っていませんか？ - 新規登録"}
            setAuthState={() => setAuthState(AuthStates.SignUp)}
            withMail={startMailSignIn}
            withGoogle={withGoogle}
            withApple={withApple}
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
              sendEmailForPasswordReset(email, "admin/auth/password_reset")
            }
            withMailSignIn={withMailSignIn}
          />
        );
      case AuthStates.SignUpWithEmailAndPassword:
        return (
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
        );
      case AuthStates.EmailSent:
        return (
          <ConfirmationSent
            onClickBack={() => handleClickBack(AuthStates.SignIn)}
          />
        );
    }
  };

  return (
    <>
      <div className="fixed -top-6 -left-6 -bottom-6 -right-6">
        <Image
          src="/journal/images/login/Journal_topbg.png"
          alt="background image"
          fill
        />
      </div>

      <div
        className="fixed top-[-3dvh] left-[20dvw] w-[30dvw] h-[30dvh] scale-75"
        ref={arcRef1}
      >
        <Image
          src="/journal/images/login/arc/arc1_journal.svg"
          alt="logo"
          fill
          className="object-contain"
        />
      </div>
      <div
        className="fixed top-[30dvh] right-[3dvw] w-[30dvw] h-[30dvh] scale-125"
        ref={arcRef2}
      >
        <Image
          src="/journal/images/login/arc/arc2_journal.svg"
          alt="logo"
          fill
          className="object-contain"
        />
      </div>
      <div
        className="fixed bottom-[-3dvh] left-[20dvw] w-[30dvw] h-[30dvh] scale-150 rotate-90"
        ref={arcRef3}
      >
        <Image
          src="/journal/images/login/arc/arc3_journal.svg"
          alt="logo"
          fill
          className="object-contain"
        />
      </div>

      <div
        className="md:flex items-center justify-center relative top-0 left-0 w-[100dvw] h-[100dvh] hidden"
        ref={logoRef}
      >
        <div className="absolute h-[400px] w-[400px]">
          <Image src="/journal/images/login/box_journal.svg" alt="logo" fill />
        </div>
        <div className="absolute h-[300px] w-[300px]">
          <Image
            src="/journal/images/login/liner_journal.svg"
            alt="logo"
            fill
          />
        </div>
        <div className="absolute h-[300px] w-[300px]">
          <Image src="/journal/images/login/Journal.svg" alt="logo" fill />
        </div>
      </div>
      <div className="flex items-center justify-center p-5 w-[100dvw] h-[100dvh] md:hidden">
        <div className="relative aspect-square w-full max-w-[500px] flex items-center justify-center">
          <Image src="/journal/images/login/box_journal.svg" alt="logo" fill />
          <div
            className="absolute flex items-center justify-center h-[75%] w-[75%]"
            ref={logoMobileRef}
          >
            <div className="absolute h-[80%] w-[80%] block md:hidden">
              <Image
                src="/journal/images/login/liner_journal.svg"
                alt="logo"
                fill
              />
            </div>
            <Image src="/journal/images/login/Journal.svg" alt="logo" fill />
          </div>
        </div>
      </div>

      <div
        className="flex items-center justify-center absolute left-0 w-[100dvw] h-[100dvh] p-8 sm:p-10"
        ref={loginRef}
      >
        <AuthForm />
      </div>
      <div
        className="flex justify-center fixed -bottom-32 right-0 left-0 h-72"
        ref={bookRef}
      >
        <Image
          src="/journal/images/login/Journalbookangle_journal.svg"
          alt="logo"
          fill
        />
      </div>
    </>
  );
};

export default Login;
