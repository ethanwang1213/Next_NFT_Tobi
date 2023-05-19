import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEventHandler, useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

const Login = () => {
  const loginRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const arcRef1 = useRef<HTMLDivElement>(null);
  const arcRef2 = useRef<HTMLDivElement>(null);
  const arcRef3 = useRef<HTMLDivElement>(null);
  const logoMobileRef = useRef<HTMLDivElement>(null);

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
      .to(logoRef.current, { x: "-250px" }, "<")
      .from(bookRef.current, { y: "14rem" }, "<")
      .to(arcRef1.current, { left: "5vw", top: "5vh" }, "<")
      .to(arcRef2.current, { top: "-2vh" }, "<")
      .to(arcRef3.current, { left: "-5vw" }, "<")
      .fromTo(
        logoMobileRef.current,
        { y: 0, maxHeight: "100%" },
        { y: "-40vh", maxHeight: "15vh" },
        "<"
      );
  });

  return (
    <>
      <div className="fixed -top-6 -left-6 -bottom-6 -right-6">
        <Image
          src="/images/login/Journal_topbg.png"
          alt="background image"
          fill
        />
      </div>

      <div
        className="fixed top-[-3vh] left-[20vw] w-[30vw] h-[30vh] scale-75"
        ref={arcRef1}
      >
        <Image
          src="/images/login/arc/arc1_journal.svg"
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
          src="/images/login/arc/arc2_journal.svg"
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
          src="/images/login/arc/arc3_journal.svg"
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
          <Image src="/images/login/box_journal.svg" alt="logo" fill />
        </div>
        <div className="absolute h-[300px] w-[300px]">
          <Image src="/images/login/liner_journal.svg" alt="logo" fill />
        </div>
        <div className="absolute h-[300px] w-[300px]">
          <Image src="/images/login/Journal.svg" alt="logo" fill />
        </div>
      </div>
      <div className="flex items-center justify-center p-5 w-screen h-screen">
        <div className="relative aspect-square w-full max-w-[500px] flex items-center justify-center md:hidden">
          <Image src="/images/login/box_journal.svg" alt="logo" fill />
          <div
            className="absolute flex items-center justify-center h-[75%] w-[75%]"
            ref={logoMobileRef}
          >
            <div className="absolute h-[80%] w-[80%] block md:hidden">
              <Image src="/images/login/liner_journal.svg" alt="logo" fill />
            </div>
            <Image src="/images/login/Journal.svg" alt="logo" fill />
          </div>
        </div>
      </div>

      <div
        className="flex items-center justify-center absolute top-0 left-0 w-screen h-screen p-10"
        ref={loginRef}
      >
        <form
          className="bg-white p-10 rounded-2xl flex flex-col gap-3 items-center md:translate-x-[250px] max-w-[400px] z-10"
          onSubmit={signIn}
        >
          <input
            type="text"
            placeholder="Email"
            className="input w-full input-bordered"
          />
          <p className="-mt-2 w-[96%] text-red-500 text-[11px] text-start">
            TOBIRA
            NEKOをご購入予定、購入後の方は購入時に使用したメールアドレスでご登録ください。
          </p>
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
