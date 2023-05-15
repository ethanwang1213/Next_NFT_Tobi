import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEventHandler, useEffect, useRef } from "react";
import gsap from "gsap";

const Login = () => {
  const loginRef = useRef<HTMLDivElement>(null);

  // サインアップリンクが押されたときに実行される関数
  const signUp = () => {};

  // sign inボタンが押されたときに実行する関数
  const signIn: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
  };

  // Googleアカウントでログインする関数
  const withGoogle = () => {};

  useEffect(() => {
    gsap
      .timeline()
      .to(loginRef.current, { width: "161px" }, "2")
      .from(loginRef.current, { opacity: 0 }, "<0.3");
  });

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
          <input type="text" placeholder="Email" className="input" />
          <p className="-mt-2 w-[96%] text-red-500 text-[11px] text-start">
        TOBIRA NEKOをご購入予定、購入後の方は購入時に使用したメールアドレスでご登録ください。
          </p>
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
        </form>
      </div>
    </div>
  );
};

export default Login;
