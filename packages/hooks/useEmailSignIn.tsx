import { auth } from "fetchers/firebase/client";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

// TODO: メールアドレスを使ってサインインする流れが変更になったので、後で修正する
const useEmailSignIn = () => {
  const router = useRouter();

  useEffect(() => {
    const email = window.localStorage.getItem("emailForSignIn");
    const emailLink = window.location.href;
    if (isSignInWithEmailLink(auth, emailLink)) {
      // リンクが正しいとき

      if (!email) {
        // ローカルストレージにemailキーが存在しない場合、もう１度入力
        const confirm = window.confirm(
          "申し訳ございませんが、ご入力いただいたメールアドレスを確認できなかったため再度ご入力お願いします。",
        );
        if (confirm) {
          router.push("/signin");
        }
      }

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
      const confirm = window.confirm(
        "申し訳ございませんが、リンクの有効期限が切れているため再度ご入力お願いします。",
      );
      if (confirm) {
        router.push("/signin");
      }
    }
  }, [router]);
};

export default useEmailSignIn;
