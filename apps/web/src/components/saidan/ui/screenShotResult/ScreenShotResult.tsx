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
    if (!isiOS()) {
      const saveA = document.createElement("a");
      saveA.href = canvasRef.current.toDataURL();
      saveA.download = "tobiratory_saidan.png";
      saveA.click();
    }
    canvasRef.current.toBlob((blob) => {
      const url = URL.createObjectURL(blob!);
      setImageSrc(url);
    }, "image/jpeg");
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
      <div className="card h-full bg-base-100">
        <figure className="relative aspect-square bg-white">
          <div
            className="saturate-50 bg-center blur-md drop-shadow-lg bg-cover bg-no-repeat absolute top-0 left-0 w-full h-full"
            style={{ backgroundImage: `url(${imageSrc})` }}
          ></div>
          {imageSrc && (
            <Image
              src={imageSrc}
              alt="result"
              fill
              className="object-contain"
            />
          )}
        </figure>
        <div className="card-body">
          <div>{isiOS() && <>上の画像を長押しすることで保存できます</>}</div>
          <div className="card-actions items-center gap-5 flex-col">
            <p className="text-3xl font-tsukub-400">SAIDANを共有</p>
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
                } screenshot-share-icon`}
              />
            </button>
          </div>
        </div>
      </div>
    </SlideUpCenteredContainer>
  );
};

export default ScreenShotResult;
