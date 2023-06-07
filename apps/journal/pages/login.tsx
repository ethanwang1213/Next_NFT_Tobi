import { FormEventHandler, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import {
  getAuth,
  sendSignInLinkToEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/router";

const Login = () => {
  const loginRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const arcRef1 = useRef<HTMLDivElement>(null);
  const arcRef2 = useRef<HTMLDivElement>(null);
  const arcRef3 = useRef<HTMLDivElement>(null);
  const logoMobileRef = useRef<HTMLDivElement>(null);
  const auth = getAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [mailSent, setMailSent] = useState(false);

  // sign inボタンが押されたときに実行する関数
  const signIn: FormEventHandler<HTMLFormElement> = (e) => {
    console.log("sign in");
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: `${window.location.origin}/journal/email/verify`,
      // This must be true.
      handleCodeInApp: true,
    };

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem("emailForSignIn", email);
        setMailSent(true);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
      });
    e.preventDefault();
  };

  // Googleアカウントでログインする関数
  const withGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      router.push("/"); // ログイン後にリダイレクトするURLを指定
    } catch (error) {
      console.error("Googleログインに失敗しました。", error);
    }
  };

  useEffect(() => {
    // console.log(auth.currentUser);
    const handleRedirect = async () => {
      // ログイン状態の変化を監視
      await auth.onAuthStateChanged((user) => {
        if (user && user.email) {
          console.log(`${user.email} としてログイン中です。`);
          // ログイン済みの場合、リダイレクト処理を実行
          router.push("/"); // リダイレクト先のURLを指定
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
        { top: "-100vh", ease: "power4.inOut" },
        { top: 0, duration: 1.5 },
        "2"
      )
      .to(
        logoRef.current,
        { x: "-250px", ease: "power4.inOut", duration: 1.5 },
        "<"
      )
      .from(
        bookRef.current,
        { y: "14rem", ease: "power4.inOut", duration: 1.5 },
        "<"
      )
      .to(
        arcRef1.current,
        { left: "5vw", top: "5vh", ease: "power4.inOut", duration: 1.5 },
        "<"
      )
      .to(
        arcRef2.current,
        { top: "-2vh", ease: "power4.inOut", duration: 1.5 },
        "<"
      )
      .to(
        arcRef3.current,
        { left: "-5vw", ease: "power4.inOut", duration: 1.5 },
        "<"
      )
      .fromTo(
        logoMobileRef.current,
        { y: 0, maxHeight: "100%" },
        { y: "-40vh", maxHeight: "15vh" },
        "<"
      );
  }, []);

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
        className="fixed top-[-3vh] left-[20vw] w-[30vw] h-[30vh] scale-75"
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
        className="fixed top-[30vh] right-[3vw] w-[30vw] h-[30vh] scale-125"
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
        className="fixed bottom-[-3vh] left-[20vw] w-[30vw] h-[30vh] scale-150 rotate-90"
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
        className="md:flex items-center justify-center relative top-0 left-0 w-screen h-screen hidden"
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
      <div className="flex items-center justify-center p-5 w-screen h-screen md:hidden">
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
        className="flex items-center justify-center absolute left-0 w-screen h-screen p-3 sm:p-10"
        ref={loginRef}
      >
        <form
          className="bg-white p-7 sm:p-10 rounded-2xl flex flex-col gap-5 items-center md:translate-x-[250px] max-w-[400px] z-10"
          onSubmit={signIn}
        >
          <button
            className="btn btn-block sm:btn-lg gap-3 flex-row btn-outline text-xs sm:text-xl"
            type="button"
            onClick={withGoogle}
          >
            <div className="relative h-[50%] aspect-square">
              <Image
                src="/journal/images/icon/google_journal.svg"
                alt="google"
                fill
              />
            </div>
            Sign in with Google
          </button>
          <div className="relative w-full before:border-t before:grow before:border-black after:border-t after:grow after:border-black flex items-center text-center gap-5">
            <p>or</p>
          </div>
          <input
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="input w-full input-bordered"
          />
          <button className="btn btn-block btn-lg btn-outline" type="submit">
            sign in
          </button>
          <p className="-mt-2 w-[96%] text-red-500 text-[11px] text-start">
            ※TOBIRA NEKO購入済みの方
            <br />
            受取には購入時に使用したメールアドレスでログインが必要です。
          </p>
          {mailSent && <p>メールを送りました</p>}
        </form>
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
