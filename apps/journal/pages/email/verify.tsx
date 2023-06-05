import { useRouter } from "next/router";
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { useEffect } from "react";
import Image from "next/image";

const Verify = () => {
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const email = window.localStorage.getItem("emailForSignIn");
    const emailLink = window.location.href;
    console.log(email);
    console.log(emailLink);
    if (isSignInWithEmailLink(auth, emailLink)) {
      // リンクが正しいとき

      if (!email) {
        // ローカルストレージにemailキーが存在しない場合、もう１度入力
        alert(
          "申し訳ございませんが、ご入力いただいたメールアドレスを確認できなかったため再度ご入力お願いします。"
        );
      }
      console.log(auth.currentUser);

      // サインイン（これを行わないとパスワードリセットができない）
      signInWithEmailLink(auth, email, emailLink)
        .then((result) => {
          console.log(result);

          // email情報を消去
          window.localStorage.removeItem("emailForSignIn");
          console.log("ログインに成功しました。", result.user);
          router.push("/"); // リダイレクト先のURLを指定
        })
        .catch((error) => {
          // ログイン失敗時の処理
          console.error("ログインに失敗しました。", error);
        });
    } else {
      // リンクが正しくないとき
      console.log(
        "申し訳ございませんが、リンクの有効期限が切れているため再度ご入力お願いします。"
      );
    }
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
      <div className="fixed top-[-3vh] left-[-5vw] md:left-[20vw] w-[300px] h-[300px] scale-75">
        <Image
          src="/journal/images/login/arc/arc1_journal.svg"
          alt="logo"
          fill
          className="object-contain"
        />
      </div>
      <div className="fixed top-[30vh] right-[-5vw] md:right-[3vw] w-[300px] h-[300px] scale-125">
        <Image
          src="/journal/images/login/arc/arc2_journal.svg"
          alt="logo"
          fill
          className="object-contain"
        />
      </div>
      <div className="fixed bottom-[-3vh] left-[-10vw] md:left-[20vw] w-[300px] h-[300px] scale-150 rotate-90">
        <Image
          src="/journal/images/login/arc/arc3_journal.svg"
          alt="logo"
          fill
          className="object-contain"
        />
      </div>
      <div className="flex items-center justify-center p-5 w-screen h-screen">
        <div className="relative aspect-square w-full max-w-[500px] flex items-center justify-center">
          <Image src="/journal/images/login/box_journal.svg" alt="logo" fill />
          <div className="absolute flex items-center justify-center h-[75%] w-[75%]">
            <div className="absolute h-[80%] w-[80%] block">
              <Image
                src="/journal/images/login/liner_journal.svg"
                alt="logo"
                fill
              />
            </div>
            <Image src="/journal/images/login/Journal.svg" alt="logo" fill />
          </div>
          <h1 className="text-4xl absolute text-accent top-[75%]">
            Logging in...
          </h1>
        </div>
      </div>
      <div className="flex justify-center fixed -bottom-32 right-0 left-0 h-72">
        <Image
          src="/journal/images/login/Journalbookangle_journal.svg"
          alt="logo"
          fill
        />
      </div>
    </>
  );
};

export default Verify;
