import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEventHandler, useEffect, useRef } from "react";
import {
  getAuth,
  sendSignInLinkToEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { useState } from 'react';
import { useRouter } from 'next/router';
import gsap from "gsap";

const Login = () => {
  const auth = getAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [mailSent, setMailSent] = useState(false);

  const loginRef = useRef<HTMLDivElement>(null);

  // サインアップリンクが押されたときに実行される関数
  const signUp = () => {};

  // sign inボタンが押されたときに実行する関数
  const signIn: FormEventHandler<HTMLFormElement> = (e) => {
    console.log("sign in");
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: `${window.location.origin}/journal/login2/email/verify`,
      // This must be true.
      handleCodeInApp: true,
    };
    
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem('emailForSignIn', email);
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
      router.push('/'); // ログイン後にリダイレクトするURLを指定
    } catch (error) {
      console.error('Googleログインに失敗しました。', error);
    }
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  useEffect(() => {
    gsap
      .timeline()
      .to(loginRef.current, { width: "161px" }, "2")
      .from(loginRef.current, { opacity: 1 }, "<0.5"); // TODO opacityを0にする
  });

  useEffect(() => {
    console.log(auth.currentUser)
    const handleRedirect = async () => {
      // ログイン状態の変化を監視
      await auth.onAuthStateChanged((user) => {
        if (user && user.email) {
          console.log(`${user.email} としてログイン中です。`);
          // ログイン済みの場合、リダイレクト処理を実行
          router.push('/'); // リダイレクト先のURLを指定
        }
      });
    };

    handleRedirect();
  }, []);

  return (
    // TODO: 背景設定
    <div className="w-screen h-screen flex items-center justify-center bg-pink-100 gap-10">
      {/* // ロゴ設置 */}
      <h1 className="text-5xl">Login</h1>

      <div className="relative h-[300px]" ref={loginRef}>
        <form
          className="backdrop-blur-md bg-white/50 p-5 rounded-2xl flex flex-col gap-3 items-center absolute"
          onSubmit={signIn}
        >
          <input type="email" placeholder="Email" className="input" value={email} onChange={handleInputChange}  />
          <button
            className="btn btn-ghost btn-outline btn-circle"
            type="button"
            onClick={withGoogle}
          >
            <FontAwesomeIcon icon={faGoogle} size="xl" />
          </button>
          <p className="text-sm">Or Login With Social Media</p>
          <button className="btn btn-block" type="submit">
            sign in
          </button>
          { mailSent && (
            <p>メールを送りました</p>
          ) }
          <p>
            Don&apos;t have an account?
            <button onClick={signUp} className="btn btn-link" type="button">
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
