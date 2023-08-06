import { animated, useSpring } from "@react-spring/web";
import { useEffect, useState } from "react";
import useSaidanStore from "@/stores/saidanStore";
import { CropData, CropperParams } from "@/types/PlacedItemData";
import { doc, setDoc } from "firebase/firestore/lite";
import BadgeCrop from "./BadgeCrop";
import PosterCrop from "./PosterCrop";
import { auth, db } from "../../../../../firebase/client";

const CropWindow = () => {
  const allSrcs = useSaidanStore((state) => state.allSrcs);
  const closeBag = useSaidanStore((state) => state.closeBag);
  const isCropWindowOpen = useSaidanStore((state) => state.isCropWindowOpen);
  const closeCropWindow = useSaidanStore((state) => state.closeCropWindow);
  const hideCropWindow = useSaidanStore((state) => state.hideCropWindow);
  const cropSrc = useSaidanStore((state) => state.cropSrc);
  const setPCropperParams = useSaidanStore((state) => state.setPCropperParams);
  const placeNewItem = useSaidanStore((state) => state.placeNewItem);

  const [imgSrc, setImgSrc] = useState("");
  const [pCropper, setPCropper] = useState<CropperParams>();

  useEffect(() => {
    if (cropSrc === null) return;

    const newSrc = allSrcs.find((v) => v.id === cropSrc?.imageId);
    if (!newSrc) return;

    setImgSrc(newSrc.imageSrc);
    if (cropSrc.itemType !== "ACRYLIC_STAND") {
      setPCropper(newSrc.pCropperParams[cropSrc.itemType]);
    }
  }, []);

  const { y } = useSpring({
    from: { y: "100vh" },
    to: { y: isCropWindowOpen ? "0" : "100vh" },
    config: { tension: 500, friction: 50 },
    onResolve: () => {
      if (isCropWindowOpen) return;
      hideCropWindow();
    },
  });

  const handleCrop = async (
    cropData: CropData,
    pCropperParams: CropperParams
  ) => {
    if (cropSrc) {
      setPCropperParams(cropSrc.imageId, cropSrc.itemType, pCropperParams);
      const src = allSrcs.find((v) => v.id === cropSrc.imageId);
      if (!src) return;
      await placeNewItem(
        cropSrc.imageId,
        cropSrc.itemType,
        src.whitedImageSrc === "",
        cropData
      );

      if (auth.currentUser) {
        const { uid } = auth.currentUser!;
        const itemRef = doc(db, `users/${uid}/src/${cropSrc.imageId}`);
        setDoc(
          itemRef,
          {
            pCropperParams:
              cropSrc.itemType === "TIN_BADGE"
                ? {
                    TIN_BADGE: pCropperParams,
                  }
                : {
                    POSTER: pCropperParams,
                  },
          },
          { merge: true }
        );
      }
    } else {
      console.log("cropSrc is undefined");
    }
    closeCropWindow();
    closeBag();
  };

  const OkButton = ({ imageId }: { imageId: string }) => (
    <label
      htmlFor={`my-modal-${imageId}`} // type select modal
      className="saidan-crop-work-btn"
    >
      OK
    </label>
  );

  return (
    <animated.div className="saidan-crop-container" style={{ y }}>
      <div className="saidan-crop-work-container-outer">
        {cropSrc?.itemType === "TIN_BADGE" && pCropper && (
          <BadgeCrop
            url={imgSrc}
            func={handleCrop}
            className="saidan-crop-work-container-inner"
            pCrop={pCropper.crop}
            pZoom={pCropper.zoom}
          >
            <OkButton imageId={cropSrc.imageId} />
          </BadgeCrop>
        )}
        {cropSrc?.itemType === "POSTER" && pCropper && (
          <PosterCrop
            url={imgSrc}
            func={handleCrop}
            className="saidan-crop-work-container-inner"
            pCrop={pCropper.crop}
            pZoom={pCropper.zoom}
          >
            <OkButton imageId={cropSrc.imageId} />
          </PosterCrop>
        )}
      </div>
      <div className="saidan-crop-close-container">
        <button
          type="button"
          className="saidan-crop-close-btn"
          onClick={closeCropWindow}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </animated.div>
  );
};

export default CropWindow;
