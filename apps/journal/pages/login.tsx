import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import AccountEmailNotif from "../components/AccountEmailNotif";

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

  const [isOkNotif, setIsOkNotif] = useState(false);

  useEffect(() => {
    if (!isOkNotif) return;

    gsap
      .timeline()
      .to(loginRef.current, { width: "161px" }, "0.5")
      .from(loginRef.current, { opacity: 0 }, "<0.3");
  }, [isOkNotif]);

  return (
    // TODO: 背景設定
    <div className="w-screen h-screen flex items-center justify-center bg-pink-100 gap-10">
      {/* // ロゴ設置 */}
      <h1 className="text-5xl">Login</h1>

      <div
        className="relative h-[300px]"
        ref={loginRef}
        style={{ display: isOkNotif ? "block" : "none" }}
      >
        <form
          className="backdrop-blur-md bg-white/50 p-5 rounded-2xl flex flex-col gap-3 items-center absolute"
          onSubmit={signIn}
        >
          <input type="text" placeholder="Email" className="input" />
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
          <p>
            Don&apos;t have an account?
            <button onClick={signUp} className="btn btn-link" type="button">
              Sign Up
            </button>
          </p>
        </form>
      </div>

      <AccountEmailNotif setIsOkNotif={setIsOkNotif} />
    </div>
  );
};

export default Login;
