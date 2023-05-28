import { useContext, useEffect, useRef } from "react";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
import allowScrollRule from "@/methods/global/allowScrollRule";
import HomeWindow from "@/components/home/HomeWindow";
import { MenuAnimationContext } from "@/context/menuAnimation";
import { gsap } from "gsap";

const Home = () => {

  // 特定の要素以外のスマホでのスクロールをロック
  const pageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!pageRef.current) return;
    disableBodyScroll(pageRef.current, {
      allowTouchMove: allowScrollRule, // スクロールロックの例外の定義
    });
    return () => {
      clearAllBodyScrollLocks();
    };
  }, [pageRef.current]);

  // メニュー鍵穴から来た時の、ページが開いたら画像をフェードアウトさせる処理
  const { imageRef, requireFadeOut, setRequireFadeOut } = useContext(MenuAnimationContext);
  useEffect(() => {
    if (!imageRef.current) return;
    if (requireFadeOut !== "HOME") return;

    gsap.timeline()
      .to(imageRef.current, { opacity: 0, duration: 0.5 }, "+=1")
      .set(imageRef.current, { display: "none", pointerEvents: "none" })
      .add(() => {
        setRequireFadeOut("");
      })
  }, [imageRef.current, requireFadeOut]);


  useEffect(() => {
    // !isLandscape && innerWidth < 520
  }, []);

  return (<div className="w-full h-full overflow-y-hidden" ref={pageRef}>
    <HomeWindow />
  </div>
  );
};

export default Home;
