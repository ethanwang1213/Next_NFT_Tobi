import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEventHandler, useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

const Login = () => {
  const loginRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);

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
      .from(loginRef.current, { top: "-100vh" }, "2")
      .to(logoRef.current, { x: "-25vw" }, "<")
      .from(bookRef.current, { y: "14rem" }, "<");
  });

  return (
    <>
      <Image
        src="/images/login/Topbg_journal.png"
        alt="background image"
        fill
      />
      <div
        className="flex items-center justify-center relative top-0 left-0 w-screen h-screen"
        ref={logoRef}
      >
        <div className="absolute h-[45vw] w-[45vw] md:h-[400px] md:w-[400px]">
          <Image src="/images/login/box_journal.svg" alt="logo" fill />
        </div>
        <div className="absolute h-[45vw] w-[45vw] md:h-[300px] md:w-[300px]">
          <Image src="/images/login/liner_journal.svg" alt="logo" fill />
        </div>
        <div className="absolute h-[35vw] w-[35vw] md:h-[300px] md:w-[300px]">
          <Image src="/images/login/Journal.svg" alt="logo" fill />
        </div>
      </div>
      <div
        className="flex items-center justify-center absolute top-0 left-0 w-screen h-screen"
        ref={loginRef}
      >
        <form
          className="bg-white p-10 rounded-2xl flex flex-col gap-3 items-center translate-x-[25vw]"
          onSubmit={signIn}
        >
          <input
            type="text"
            placeholder="Email"
            className="input w-full input-bordered"
          />
          <button
            className="btn btn-ghost btn-outline btn-circle"
            type="button"
            onClick={withGoogle}
          >
            <FontAwesomeIcon icon={faGoogle} size="xl" />
          </button>
          <p className="text-sm">Or Login With Social Media</p>
          <button className="btn btn-block btn-lg" type="submit">
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
      <div
        className="flex justify-center fixed -bottom-32 right-0 left-0 h-72"
        ref={bookRef}
      >
        <Image
          src="/images/login/Journalbookangle_journal.svg"
          alt="logo"
          fill
        />
      </div>
    </>
  );
};

export default Login;
