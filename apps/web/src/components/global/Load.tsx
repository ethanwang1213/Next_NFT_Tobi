import { Dispatch, FC, SetStateAction, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

type props = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const LoadTransition: FC<props> = ({ isOpen, setOpen }) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const keyRef = useRef<HTMLDivElement>(null);
  const keyParentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    gsap
      .timeline()
      .set(loadingRef.current, { display: "block" })
      .fromTo(
        keyRef.current,
        {
          height: "106px",
        },
        {
          height: "256px",
          duration: 1,
        },
        "+=1"
      )
      .fromTo(
        textRef.current,
        {
          maxWidth: "0%",
        },
        {
          maxWidth: "100%",
          duration: 1,
        },
        "<"
      )
      .to(textRef.current, { opacity: 0, duration: 0.5 }, "+=0.5")
      .fromTo(
        keyRef.current,
        {
          backgroundColor: "#44403c",
        },
        {
          backgroundColor: "#fff",
          duration: 0.5,
        },
        "<"
      )
      .to(
        keyParentRef.current,
        {
          translateY: "100vh",
          opacity: 0,
          duration: 1,
        },
        "+=0.5"
      )
      .to(
        loadingRef.current,
        {
          opacity: 0,
          // scale: 0.9,
          duration: 0.8,
        },
        "<"
      )
      .set(loadingRef.current, { display: "none" })
      .then(() => {
        setOpen(false);
      });
  }, [isOpen]);

  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 overflow-hidden" ref={loadingRef}>
      <Image src="/menu/load/home.png" fill alt="背景画像" priority />
      <div className="w-full h-full absolute flex items-center justify-center flex-col gap-8">
        <div className="h-[256px] w-24 rotate-[30deg]" ref={keyParentRef}>
          <div
            style={{
              WebkitMaskImage: "url(/loading/key.svg)",
              maskImage: "url(/loading/key.svg)",
              WebkitMaskSize: "cover",
              maskSize: "cover",
            }}
            ref={keyRef}
          />
        </div>
        <div>
          <p
            className="font-['tachyon'] text-3xl overflow-hidden text-stone-700"
            ref={textRef}
          >
            loading
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoadTransition;
