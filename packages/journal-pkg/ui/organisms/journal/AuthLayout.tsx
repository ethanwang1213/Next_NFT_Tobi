import gsap from "gsap";
import Image from "next/image";
import { ReactNode, useEffect, useRef } from "react";

type Props = {
  children: ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  const loginRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const arcRef1 = useRef<HTMLDivElement>(null);
  const arcRef2 = useRef<HTMLDivElement>(null);
  const arcRef3 = useRef<HTMLDivElement>(null);
  const logoMobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap
      .timeline()
      .fromTo(
        loginRef.current,
        { top: "-100dvh", ease: "power4.inOut" },
        { top: 0, duration: 1.5 },
        "2",
      )
      .to(
        logoRef.current,
        { x: "-250px", ease: "power4.inOut", duration: 1.5 },
        "<",
      )
      .from(
        bookRef.current,
        { y: "14rem", ease: "power4.inOut", duration: 1.5 },
        "<",
      )
      .to(
        arcRef1.current,
        { left: "5dvw", top: "5dvh", ease: "power4.inOut", duration: 1.5 },
        "<",
      )
      .to(
        arcRef2.current,
        { top: "-2dvh", ease: "power4.inOut", duration: 1.5 },
        "<",
      )
      .to(
        arcRef3.current,
        { left: "-5dvw", ease: "power4.inOut", duration: 1.5 },
        "<",
      )
      .fromTo(
        logoMobileRef.current,
        { y: 0, maxHeight: "100%" },
        { y: "-40dvh", maxHeight: "15dvh" },
        "<",
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
        {children}
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
    </>
  );
};

export default AuthLayout;
