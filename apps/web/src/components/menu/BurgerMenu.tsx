import { ShowBurgerContext } from "@/context/showBurger";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { MenuAnimationContext } from "@/context/menuAnimation";
import { gsap } from "gsap";
import Menu from "./Menu";

/**
 * ハンバーガーメニューを表示するコンポーネント
 * @returns
 */
const BurgerMenu = () => {
  const { imageUrl, imageRef } = useContext(MenuAnimationContext);
  const { showBurger } = useContext(ShowBurgerContext);

  useEffect(() => {
    if (imageRef.current) {
      gsap.set(imageRef.current, { opacity: 0, display: "none", pointerEvents: "none" });
    }
  }, [imageRef.current, showBurger]);

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return <>
    <div ref={imageRef} className="absolute z-50 top-0 bottom-0 left-0 right-0">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt="loading image"
          fill
          className="object-cover"
        />
      )}
    </div>
    {showBurger && <>
      <div className="menu-burger-btn">
        <FontAwesomeIcon
          icon={faBars}
          onClick={toggle}
        />
      </div>
      <Menu isOpen={isOpen} setOpen={setIsOpen} />
    </>}
  </>
};

export default BurgerMenu;
