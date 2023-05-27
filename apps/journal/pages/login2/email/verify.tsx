import { useRouter } from "next/router";
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink
} from 'firebase/auth'
import { useEffect } from "react";

const Verify = () => {
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const email = window.localStorage.getItem('emailForSignIn');
    const emailLink = window.location.href;
    console.log(email);
    console.log(emailLink);
    if (isSignInWithEmailLink(auth, emailLink)) {
      // リンクが正しいとき
  
      if (!email) {
        // ローカルストレージにemailキーが存在しない場合、もう１度入力
        alert('申し訳ございませんが、ご入力いただいたメールアドレスを確認できなかったため再度ご入力お願いします。')
      }
      console.log(auth.currentUser);
  
      // サインイン（これを行わないとパスワードリセットができない）
      signInWithEmailLink(auth, email, emailLink)
        .then((result) => {
          console.log(result);

          // email情報を消去
          window.localStorage.removeItem('emailForSignIn')
          console.log('ログインに成功しました。', result.user);
          router.push('/'); // リダイレクト先のURLを指定
        }).catch((error) => {
          // ログイン失敗時の処理
          console.error('ログインに失敗しました。', error);
        });
    } else {
      // リンクが正しくないとき
      console.log('申し訳ございませんが、リンクの有効期限が切れているため再度ご入力お願いします。')
    }
  }, [])

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-pink-100 gap-10">
      <h1>ログイン処理中...</h1>
    </div>
  );
};

export default Verify;
