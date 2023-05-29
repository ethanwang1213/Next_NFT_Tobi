import { RefObject, useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import useWindowSize from "@/hooks/useWindowSize";
import useSaidanStore from "@/stores/saidanStore";
import isiOS from "@/methods/isiOS";
import { TWEET_URL, TWEET_HASH_TAG } from "@/constants/saidanConstants";
import SlideUpCenteredContainer from "@/components/global/centeredContainer.tsx/SlideUpCenteredContainer";

type Props = {
  canvasRef: RefObject<HTMLCanvasElement>;
};

const ScreenShotResult = ({ canvasRef }: Props) => {
  const closeScreenShotResult = useSaidanStore(
    (state) => state.closeScreenShotResult
  );

  const [imageSrc, setImageSrc] = useState("");

  const { isWide } = useWindowSize();

  // キャンバスのスクショを設定
  useEffect(() => {
    if (!canvasRef.current) return;
    setImageSrc(canvasRef.current.toDataURL("image/jpeg"));
  }, [canvasRef.current]);

  const handleShareClick = () => {
    const url = TWEET_URL;
    const hashtags = TWEET_HASH_TAG;
    window.open(`http://twitter.com/share?url=${url}&hashtags=${hashtags}`);
  };

  return (
    <SlideUpCenteredContainer
      outerClassName="saidan-screenshot-container-outer"
      innerClassName="saidan-screenshot-container-inner"
      aspectWidth={6}
      aspectHeight={8}
      widthRate={0.9}
      heightRate={0.9}
      closeMethod={closeScreenShotResult}
    >
      <div className="saidan-screenshot-content-container">
        <div className="saidan-screenshot-image">
          {imageSrc && (
            <Image
              src={imageSrc}
              alt="result"
              fill
              style={{ objectFit: "contain" }}
            />
          )}
        </div>
        <div className="saidan-screenshot-ios-msg">
          {isiOS() && <>上の画像を長押しすることで保存できます</>}
        </div>
        <div className="saidan-screenshot-share-container">
          <button
            type="button"
            className="screenshot-share-btn"
            onClick={handleShareClick}
          >
            <FontAwesomeIcon
              color="white"
              icon={faTwitter}
              className={`${
                isWide ? "fa-2xl" : "fa-xl"
              } fa-xl screenshot-share-icon`}
            />
          </button>
        </div>
      </div>
    </SlideUpCenteredContainer>
  );
};

export default ScreenShotResult;
