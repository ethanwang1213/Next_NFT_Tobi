import { animated, useSpring } from "@react-spring/web";
import useSaidanStore from "@/stores/saidanStore";
import useWindowSize from "@/hooks/useWindowSize";
import ImageInBag from "./ImageInBag";
import AddItemButton from "./AddItemButton";
import CloseButton from "./CloseButton";
import ShopBanner from "./ShopBanner";

const Bag = () => {
  const isBagVisible = useSaidanStore((state) => state.isBagVisible);
  const isBagOpen = useSaidanStore((state) => state.isBagOpen);
  const closeBag = useSaidanStore((state) => state.closeBag);
  const hideBag = useSaidanStore((state) => state.hideBag);
  const allSrcs = useSaidanStore((state) => state.allSrcs);

  const { y, opacity } = useSpring({
    from: { y: "100vh", opacity: 0 },
    to: { y: isBagOpen ? "0" : "100vh", opacity: isBagOpen ? 1 : 0 },
    config: { tension: 500, friction: 50 },
    onResolve: () => {
      if (isBagOpen) return;
      hideBag();
    },
  });

  const reverseSrcs = [...allSrcs].reverse();
  const { displayHeight, isWide } = useWindowSize();

  return (
    <animated.div
      className="saidan-bag-container-outer"
      style={{
        opacity,
        paddingTop: (isWide ? 0.3 : 0.2) * displayHeight,
        pointerEvents: isBagVisible ? "auto" : "none",
      }}
    >
      <animated.div className="saidan-bag-container-inner" style={{ y }}>
        <div className="saidan-bag-close-btn">
          <CloseButton onClick={closeBag} />
        </div>
        <div className="saidan-bag-grid-container" data-allowscroll="true">
          {isWide ? (
            <>
              <AddItemButton />
              <ImageInBag
                imageId={allSrcs[0].id}
                imageSrc={allSrcs[0].imageSrc}
              />
              <ShopBanner />
              {reverseSrcs.map((image, index) =>
                index !== reverseSrcs.length - 1 ? (
                  <ImageInBag
                    key={image.id}
                    imageId={image.id}
                    imageSrc={image.imageSrc}
                  />
                ) : null
              )}
            </>
          ) : (
            <>
              <AddItemButton />
              <ShopBanner />
              {reverseSrcs.map((image, index) => (
                <ImageInBag
                  key={image.id}
                  imageId={image.id}
                  imageSrc={image.imageSrc}
                />
              ))}
            </>
          )}
        </div>
      </animated.div>
    </animated.div>
  );
};

export default Bag;
