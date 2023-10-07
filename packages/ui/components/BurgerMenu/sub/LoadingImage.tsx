import { useEffect, useMemo } from "react";
import Image from "next/image";
import { menuItem } from "./../assets/menuItems";
import { gsap } from "gsap";
import { useMenuAnimation } from "contexts/menu/MenuAnimation";

/**
 * 鍵穴クリック後のローディング画像を表示するコンポーネント
 * @returns
 */
export const LoadingImage: React.FC = () => {
  const { imageUrl, imageRef } = useMenuAnimation();
  useEffect(() => {
    if (imageRef.current) {
      gsap.set(imageRef.current, {
        opacity: 0,
        display: "none",
        pointerEvents: "none",
      });
    }
  }, [imageRef.current]);

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
            className={`object-cover ${item.loadImage === imageUrl ? "" : "hidden"
              }`}
          />
        )),
    [menuItem, imageUrl]
  );

  return (
    <div ref={imageRef} className="fixed z-50 top-0 bottom-0 left-0 right-0">
      {createLoadingImage}
    </div>
  );
};
