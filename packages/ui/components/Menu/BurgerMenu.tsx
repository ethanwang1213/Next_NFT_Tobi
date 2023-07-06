import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";

import { useShowBurger } from "../../contexts/menu/showBurger";
import { useMenuAnimation } from "../../contexts/menu/menuAnimation";
import Menu from "./Menu";
import menuItem from "../../data/menu.json";

type Props = {
  initHomeStates?: () => void;
};

/**
 * ハンバーガーメニューを表示するコンポーネント
 * @returns
 */
export const BurgerMenu: React.FC<Props> = ({ initHomeStates }) => {
  const { imageUrl, imageRef } = useMenuAnimation();
  const { showBurger } = useShowBurger();

  useEffect(() => {
    if (imageRef.current) {
      gsap.set(imageRef.current, {
        opacity: 0,
        display: "none",
        pointerEvents: "none",
      });
    }
  }, [imageRef.current, showBurger]);

  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const createLoadingImage = useMemo(
    () =>
      menuItem
        .filter((v) => v.show)
        .map((item) => (
          <Image
            key={item.name}
            src={item.loadImage}
            alt="loading image"
            fill
            className={`object-cover ${
              item.loadImage === imageUrl ? "" : "hidden"
            }`}
          />
        )),
    [menuItem, imageUrl]
  );

  return (
    <>
      <div
        ref={imageRef}
        className="absolute z-50 top-0 bottom-0 left-0 right-0"
      >
        {createLoadingImage}
      </div>
      {showBurger && !isVisible && (
        <button
          className="absolute top-4 right-4 
            min-h-[48px] w-[48px] sm:w-[62px] h-[48px] sm:h-[62px] 
            btn btn-circle btn-ghost bg-black 
            text-[26px] text-white sm:text-[32px] 
            mix-blend-difference"
          onClick={toggle}
        >
          <FontAwesomeIcon
            icon={faBars}
            className="w-full max-h-full h-[100px] w-[32px] h-[32px]"
          />
        </button>
      )}
      <Menu
        isOpen={isOpen}
        setOpen={setIsOpen}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        initHomeStates={initHomeStates}
      />
    </>
  );
};
