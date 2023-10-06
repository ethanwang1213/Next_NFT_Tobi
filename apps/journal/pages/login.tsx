import { auth } from "fetchers/firebase/journal-client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import {
  sendSignInLinkToEmail,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
} from "firebase/auth";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple } from "@fortawesome/free-brands-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { StampRallyRewardForm } from "ui";

type LoginFormType = {
  email: string;
};

const Login = () => {
  const loginRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const arcRef1 = useRef<HTMLDivElement>(null);
  const arcRef2 = useRef<HTMLDivElement>(null);
  const arcRef3 = useRef<HTMLDivElement>(null);
  const logoMobileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const emailModalRef = useRef<HTMLDialogElement>(null);
  const appleModalRef = useRef<HTMLDialogElement>(null);
  const [isAppleModalChecked, setAppleModalChecked] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const appleErrModalRef = useRef<HTMLDialogElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    defaultValues: {
      email: "",
    },
  });

  // sign inボタンが押されたときに実行する関数
  const signIn = handleSubmit(async (data: LoginFormType) => {
    if (!data) return;
    console.log("sign in");
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: `${window.location.origin}/journal/email/verify`,
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
        // ...
        setIsEmailLoading(false);
      });
  });

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

  useEffect(() => {
    // console.log(auth.currentUser);
    const handleRedirect = async () => {
      // ログイン状態の変化を監視
      auth.onAuthStateChanged(async (user) => {
        if (user && user.email) {
          // 非公開ドメインの場合はアカウント削除をし登録できないようにする
          if (user.email.indexOf("privaterelay.appleid.com") !== -1) {
            await user.delete();
            appleErrModalRef.current.showModal();
          } else {
            console.log(`${user.email} としてログイン中です。`);
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
        { left: "5dvw", top: "5dvh", ease: "power4.inOut", duration: 1.5 },
        "<"
      )
      .to(
        arcRef2.current,
        { top: "-2dvh", ease: "power4.inOut", duration: 1.5 },
        "<"
      )
      .to(
        arcRef3.current,
        { left: "-5dvw", ease: "power4.inOut", duration: 1.5 },
        "<"
      )
      .fromTo(
        logoMobileRef.current,
        { y: 0, maxHeight: "100%" },
        { y: "-40dvh", maxHeight: "15dvh" },
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
        <form
          className="bg-white p-7 sm:p-10 rounded-[40px] sm:rounded-[50px] flex flex-col gap-5 items-center md:translate-x-[250px] max-w-[400px] z-10"
          onSubmit={signIn}
        >
          <button
            className="btn btn-block rounded-full gap-3 flex-row text-md sm:text-lg sm:h-[56px] 
                drop-shadow-[0_6px_8px_rgba(0,0,0,0.2)]"
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
          <button
            className="btn btn-block rounded-full gap-3 flex-row text-md sm:text-lg sm:h-[56px] 
            drop-shadow-[0_6px_8px_rgba(0,0,0,0.2)]"
            type="button"
            onClick={() => {
              appleModalRef.current.showModal();
            }}
          >
            <FontAwesomeIcon icon={faApple} size="xl" />
            Sign in with Apple
          </button>
          <div
            className="relative w-full before:border-t before:grow before:border-black after:border-t after:grow after:border-black 
                flex items-center text-center gap-5"
          >
            <p>or</p>
          </div>
          <div className="w-full">
            <input
              type="text"
              placeholder="Email"
              {...register("email", {
                required: {
                  value: true,
                  message: "*メールアドレスを入力してください。",
                },
                pattern: {
                  value: /^[\w\-._+]+@[\w\-._]+\.[A-Za-z]+/,
                  message: "*メールアドレスの形式で入力してください",
                },
              })}
              className="input rounded-full bg-slate-100 w-full input-bordered 
                text-md sm:text-lg placeholder:text-sm sm:placeholder:text-md sm:h-[56px] px-6"
            />
            <p className="pl-2 pt-1 text-[10px] text-error">
              {errors.email && `${errors.email.message}`}
            </p>
          </div>
          <button
            className="btn btn-block rounded-full text-md sm:text-lg sm:h-[56px] 
                drop-shadow-[0_6px_8px_rgba(0,0,0,0.2)]"
            type="submit"
          >
            Sign in
          </button>
          <p className="mt-2 w-full text-red-500 text-[10px] text-center">
            ※TOBIRA NEKO購入済みの方
            <br />
            受取には購入時に使用したメールアドレスでのログインが必要です。
          </p>
          <div>
            {isEmailLoading && (
              <span className="loading loading-spinner text-info loading-md"></span>
            )}
          </div>
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
      <dialog id="loginModal" className="modal" ref={emailModalRef}>
        <form method="dialog" className="modal-box bg-secondary">
          <h3 className="font-bold text-base sm:text-xl text-accent">
            メールを送信しました
          </h3>
          <div className="text-xs sm:text-sm text-accent">
            <p className="py-4">
              ログイン認証のメールを記入されたアドレスへ送信しました。
              <br />
              メールをご確認いただき、記載されたURLからログインを完了させてください。
            </p>
            <p className="font-bold">メールが届かない場合</p>
            <ul className="list-disc pl-6 mt-2">
              <li>迷惑メールフォルダやフィルターの設定をご確認ください。</li>
              <li>時間をあけてから、再度ログインをお試しください。</li>
            </ul>
          </div>
          <div className="modal-action">
            <button className="btn btn-sm sm:btn-md text-xs sm:text-base btn-outline btn-accent">
              閉じる
            </button>
          </div>
        </form>
      </dialog>

      <dialog id="appleModal" className="modal" ref={appleModalRef}>
        <form method="dialog" className="modal-box bg-secondary">
          <button className="btn btn-md btn-circle btn-ghost absolute right-2 top-2">
            <FontAwesomeIcon
              icon={faXmark}
              fontSize={24}
              className="text-accent"
            />
          </button>

          <h3 className="font-bold text-base sm:text-xl text-accent text-center">
            「Appleでサインイン」での注意
          </h3>
          <div className="text-sm sm:text-base text-accent grid gap-4 py-8">
            <p>
              初めて「Appleでサインイン」する場合、
              <br />
              メールアドレスを登録先サービス（今回の場合はJournal）へ共有するかどうかの選択が表示されます。
            </p>
            <p>
              TOBIRA NEKOの受け取りのため、
              <span className="inline-block">【メールを共有】</span>{" "}
              を選択して、ログインをお願いします。
            </p>
            <div className="grid gap-2 leading-[13px] sm:leading-4 pl-4 text-[10px] sm:text-[12px]">
              <p>
                TOBIRA
                NEKO購入時のメールアドレスとJournalアカウントのメールアドレスが同一でなければ、TOBIRA
                NEKOを受け取ることができません。
              </p>
              <p>
                非公開状態にすると、メールアドレスの@以降が（privaterelay.appleid.com）となり、受け取りができなくなります。
              </p>
            </div>
          </div>
          <div className="flex justify-center mb-4 text-accent">
            <label className="flex">
              <input
                type="checkbox"
                checked={isAppleModalChecked}
                className="checkbox checkbox-accent"
                onClick={() => setAppleModalChecked(!isAppleModalChecked)}
                onChange={() => { }}
              />
              <div className="grid content-center ml-2">
                <span className="select-none sm:text-sm">確認しました</span>
              </div>
            </label>
          </div>
          <div className="flex justify-center">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-sm sm:btn-md w-[30%] text-xs sm:text-base btn-outline btn-accent"
              onClick={withApple}
              disabled={!isAppleModalChecked}
            >
              進む
            </button>
          </div>
        </form>
      </dialog>
      <dialog id="appleErrModal" className="modal" ref={appleErrModalRef}>
        <form method="dialog" className="modal-box bg-secondary">
          <h3 className="font-bold text-lg pb-5">
            【メールを非公開】の設定でログインしようとしているようです
          </h3>
          <p>
            Apple
            IDでメールアドレスの非公開設定を有効にしていると、メールアドレスが@privaterelay.appleid.comというドメインで登録されてしまいTOBIRA
            NEKOが受け取れないため、メールの非公開の設定でアカウント作成はできません。
          </p>
          <p className="py-3">
            apple
            IDとTobiratoryの紐づけを解除し、&ldquo;メールを共有&rdquo;を選択して、ログインをお願いします。
          </p>
          <a
            href="https://support.apple.com/ja-jp/HT210426"
            className="btn btn-link"
          >
            紐づけの解除方法はこちら
          </a>
          <a
            href="https://support.apple.com/ja-jp/HT210425"
            className="btn btn-link"
          >
            メールの非公開について詳しくはこちら
          </a>

          <div className="modal-action">
            <button className="btn btn-sm sm:btn-md text-xs sm:text-base btn-outline btn-accent">
              閉じる
            </button>
          </div>
        </form>
      </dialog>
      <div className="absolute left-0 top-0 z-100">

        <StampRallyRewardForm />
      </div>
    </>
  );
};

export default Login;
