import { faApple } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { auth } from "fetchers/firebase/client";
import {
  GoogleAuthProvider,
  OAuthProvider,
  sendSignInLinkToEmail,
  signInWithPopup,
} from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

type LoginFormType = {
  email: string;
};

const Login = () => {
  const router = useRouter();
  const emailModalRef = useRef<HTMLDialogElement>(null);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

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
  });

  // Googleアカウントでログインする関数
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

  useEffect(() => {
    const handleRedirect = async () => {
      // ログイン状態の変化を監視
      auth.onAuthStateChanged(async (user) => {
        if (user?.email) {
          console.log(`${user.email} としてログイン中です。`);
          // サインイン済みの場合、リダイレクト処理を実行
          await router.push("/"); // リダイレクト先のURLを指定
        }
      });
    };
    void handleRedirect();
  }, [router]);

  return (
    <>
      <div className="flex items-center justify-center w-[100dvw] h-[100dvh] p-8 sm:p-10">
        <form
          className="bg-white p-7 sm:p-10 rounded-[40px] sm:rounded-[50px] flex flex-col gap-5 items-center max-w-[400px] z-10"
          onSubmit={signIn}
        >
          <button
            className="btn btn-block rounded-full bg-white gap-3 flex-row text-md sm:text-lg sm:h-[56px]
                drop-shadow-[0_6px_8px_rgba(0,0,0,0.2)]"
            type="button"
            onClick={withGoogle}
          >
            <div className="relative h-[50%] aspect-square">
              <Image src="/admin/images/icon/google.svg" alt="google" fill />
            </div>
            Sign in with Google
          </button>
          <button
            className="btn btn-block bg-white rounded-full gap-3 flex-row text-md sm:text-lg sm:h-[56px]
            drop-shadow-[0_6px_8px_rgba(0,0,0,0.2)]"
            type="button"
            onClick={withApple}
          >
            <FontAwesomeIcon icon={faApple} size="xl" />
            Sign in with Apple
          </button>
          <div
            className="relative w-full before:border-t before:grow before:border-primary after:border-t after:grow after:border-primary
                flex items-center text-center gap-5 text-primary"
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
            className="btn btn-block btn-primary rounded-full text-md text-neutral sm:text-lg sm:h-[56px]
                drop-shadow-[0_6px_8px_rgba(0,0,0,0.2)]"
            type="submit"
          >
            Sign in
          </button>
          <div>
            {isEmailLoading && (
              <span className="loading loading-spinner text-info loading-md"></span>
            )}
          </div>
        </form>
      </div>
      <dialog id="loginModal" className="modal" ref={emailModalRef}>
        <form method="dialog" className="modal-box bg-neutral">
          <h3 className="font-bold text-base sm:text-xl text-neutral-content">
            メールを送信しました
          </h3>
          <div className="text-xs sm:text-sm text-neutral-content">
            <p className="py-4">
              サインイン認証のメールを記入されたアドレスへ送信しました。
              <br />
              メールをご確認いただき、記載されたURLからサインインを完了させてください。
            </p>
            <p className="font-bold">メールが届かない場合</p>
            <ul className="list-disc pl-6 mt-2">
              <li>迷惑メールフォルダやフィルターの設定をご確認ください。</li>
              <li>時間をあけてから、再度サインインをお試しください。</li>
            </ul>
          </div>
          <div className="modal-action">
            <button className="btn btn-sm sm:btn-md text-xs sm:text-base btn-primary text-neutral">
              閉じる
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default Login;
