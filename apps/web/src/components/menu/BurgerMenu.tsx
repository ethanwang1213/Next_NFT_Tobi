import { ShowBurgerContext } from "@/context/showBurger";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { MenuAnimationContext } from "@/context/menuAnimation";
import { gsap } from "gsap";
import Menu from "./Menu";
import menuItem from "@/data/menu.json";

/**
 * ハンバーガーメニューを表示するコンポーネント
 * @returns
 */
const BurgerMenu = () => {
  const { imageUrl, imageRef } = useContext(MenuAnimationContext);
  const { showBurger } = useContext(ShowBurgerContext);

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
      <div className="menu-burger-btn mix-blend-difference">
        {showBurger && !isVisible && (
          <FontAwesomeIcon icon={faBars} onClick={toggle} />
        )}
      </div>
      <Menu
        isOpen={isOpen}
        setOpen={setIsOpen}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
    </>
  );
};

export default BurgerMenu;
