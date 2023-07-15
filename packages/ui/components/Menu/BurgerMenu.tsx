/* eslint-disable react/no-unknown-property */
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import MenuFooter from "./MenuFooter";
import { useShowBurger } from "../../contexts/menu/showBurger";
import KeyMenuItems from "./KeyMenuItems/KeyMenuItems";
import { useWindowSize } from "../../hooks/useWindowSize";
import TextMenuItems from "./TextMenuItems";
import CloseButton from "./CloseButton";
import LoadingImage from "./LoadingImage";
import BurgerButton from "./BurgerButton";

type Props = {
  initHomeStates?: () => void;
};

/**
 * メニューを表示するコンポーネント
 * @param param0
 * @returns
 */
export const BurgerMenu: React.FC<Props> = ({ initHomeStates }) => {
  const { isMenuOpen } = useShowBurger();
  // メニューを閉じているときにリサイズすると
  // ちらりとメニューが見えてしまう挙動への対策に必要
  const [isVisible, setIsVisible] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const { displayWidth } = useWindowSize();
  const [isAnimatedOpen, setIsAnimatedOpen] = useState(false);

  // メニューの表示/非表示のアニメーション
  useEffect(() => {
    if (isMenuOpen) {
      gsap
        .fromTo(
          menuRef.current,
          {
            x: `${displayWidth}px`,
          },
          {
            x: "0px",
            duration: isAnimatedOpen ? 0 : 0.5,
          }
        )
        .then(() => {
          setIsAnimatedOpen(true);
        });
    } else {
      gsap
        .to(menuRef.current, {
          x: `${displayWidth}px`,
          duration: 0.5,
        })
        .then(() => {
          setIsVisible(false);
          setIsAnimatedOpen(false);
        });
    }
  }, [isMenuOpen, displayWidth]);

  // メニューが開くときに表示する
  useEffect(() => {
    if (isMenuOpen) {
      setIsVisible(true);
    }
  }, [isMenuOpen]);

  return (
    <>
      <BurgerButton />
      <CloseButton />
      <LoadingImage />
      {/* メニュー内容 */}
      <div
        className={`z-40 fixed inset-0 bg-slate-800 overflow-y-auto overflow-x-hidden 
          scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-300 ${
            isVisible ? "" : "invisible"
          }`}
        ref={menuRef}
        style={{ transform: `translate(${displayWidth}px, 0px)` }}
        data-allowscroll="true"
      >
        <KeyMenuItems initHomeStates={initHomeStates} />
        <div
          className="top-0 h-0 w-full relative flex px-4 pb-3 flex-col justify-end 
            text-white text-[20px] sm:text-3xl sm:gap-1"
        >
          <TextMenuItems initHomeStates={initHomeStates} />
          <MenuFooter />
        </div>
      </div>
    </>
  );
};
