import "rc-slider/assets/index.css";
import React, { useCallback, useRef, useState } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import ButtonGroupComponent from "./ButtonGroupComponent";
import GenerateErrorComponent from "./GenerateErrorComponent";
import RotateSliderComponent from "./RotateSliderComponent";

type Props = {
  imageUrl: string;
  backHandler: () => void;
  nextHandler: (image: string, materialImage: string) => void;
  error: boolean;
  errorHandler: () => void;
  isGenerate: boolean;
};

const ImageZoomCropComponent: React.FC<Props> = (props) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const blobUrlRef = useRef("");

  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rotate, setRotate] = useState(180);
  const [scale, setScale] = useState(1);

  const [crop, setCrop] = useState<Crop>({
    unit: "px",
    x: 0,
    y: 0,
    width: 200,
    height: 200,
  });

  const imageLoadHandler = useCallback(() => {
    if (imgRef.current) {
      const { width: displayedWidth, height: displayedHeight } =
        imgRef.current.getBoundingClientRect();

      const offsetX = (400 - displayedWidth) / 2;
      const offsetY = (379 - displayedHeight) / 2;

      const initialCrop: Crop = {
        unit: "px",
        x: offsetX + (displayedWidth - crop.width) / 2,
        y: offsetY + (displayedHeight - crop.height) / 2,
        width: crop.width,
        height: crop.height,
      };
      setCrop(initialCrop);
    }
    setLoading(false);
  }, [crop.width, crop.height]);

  const rotateChangeHandler = useCallback((rotate) => {
    setRotate(rotate);
  }, []);

  const calculateSafeZoneStyles = (crop: Crop) => {
    const safeZoneWidth = crop.width * 0.86;
    const safeZoneHeight = crop.height * 0.86;
    const outlineWidth = (crop.width - safeZoneWidth) / 2;

    return {
      width: `${safeZoneWidth}px`,
      height: `${safeZoneHeight}px`,
      left: `${crop.x + (crop.width - safeZoneWidth) / 2}px`,
      top: `${crop.y + (crop.height - safeZoneHeight) / 2}px`,
      outline: `${outlineWidth}px solid #ff8484`,
      borderRadius: "50%",
    };
  };

  const [safeZoneStyles, setSafeZoneStyles] = useState(
    calculateSafeZoneStyles(crop),
  );

  const cropChangeHandler = (newCrop: Crop) => {
    setCrop(newCrop);
    setSafeZoneStyles(calculateSafeZoneStyles(newCrop));
  };

  const cropImage = useCallback(async () => {
    const image = imgRef.current;

    if (!image) {
      return;
    }

    const { width: displayedWidth, height: displayedHeight } =
      image.getBoundingClientRect();

    const scaleX = image.naturalWidth / displayedWidth;
    const scaleY = image.naturalHeight / displayedHeight;
    const offsetX = (400 - displayedWidth) / 2;
    const offsetY = (379 - displayedHeight) / 2;

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    if (!tempCtx) {
      throw new Error("No 2d context for temporary canvas");
    }

    const angleInRadians = ((180 - rotate) * Math.PI) / 180;
    const sin = Math.abs(Math.sin(angleInRadians));
    const cos = Math.abs(Math.cos(angleInRadians));
    const rotatedNaturalWidth =
      image.naturalWidth * cos + image.naturalHeight * sin;
    const rotatedNaturalHeight =
      image.naturalWidth * sin + image.naturalHeight * cos;

    tempCanvas.width = rotatedNaturalWidth;
    tempCanvas.height = rotatedNaturalHeight;

    tempCtx.translate(rotatedNaturalWidth / 2, rotatedNaturalHeight / 2);
    tempCtx.rotate(angleInRadians);
    tempCtx.translate(-image.naturalWidth / 2, -image.naturalHeight / 2);
    tempCtx.drawImage(image, 0, 0);

    const finalCanvas = document.createElement("canvas");
    const finalCtx = finalCanvas.getContext("2d");

    if (!finalCtx) {
      throw new Error("No 2d context for final canvas");
    }

    const cropSize = Math.min(crop.width, crop.height) * scale;
    finalCanvas.width = cropSize * scaleX;
    finalCanvas.height = cropSize * scaleY;

    finalCtx.fillStyle = "white";
    finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

    const adjustedCropX =
      (crop.x - offsetX) * scaleX +
      (rotatedNaturalWidth - image.naturalWidth) / 2;
    const adjustedCropY =
      (crop.y - offsetY) * scaleY +
      (rotatedNaturalHeight - image.naturalHeight) / 2;

    finalCtx.drawImage(
      tempCanvas,
      adjustedCropX,
      adjustedCropY,
      cropSize * scaleX,
      cropSize * scaleY,
      0,
      0,
      finalCanvas.width,
      finalCanvas.height,
    );

    const blob = await new Promise<Blob | null>((resolve) =>
      finalCanvas.toBlob(resolve, "image/png"),
    );

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = blob ? URL.createObjectURL(blob) : "";
  }, [crop, rotate, scale]);

  const nextHandler = useCallback(async () => {
    setProcessing(true);
    await cropImage();
    props.nextHandler(blobUrlRef.current, props.imageUrl);
  }, [props, cropImage]);

  return (
    <div className="h-full relative">
      {processing && !props.error && (
        <div className="absolute left-0 right-0 top-0 bottom-0 z-10 flex justify-center items-center bg-white/50">
          <span className="dots-circle-spinner loading2 text-[80px] text-[#FF811C]"></span>
        </div>
      )}
      {!props.error ? (
        <div>
          <ReactCrop
            crop={crop}
            onChange={(c) => cropChangeHandler(c)}
            keepSelection={true}
            circularCrop
            aspect={1}
          >
            <div className="w-[400px] h-[379px] flex justify-center items-center overflow-hidden">
              {loading && (
                <div className="absolute left-0 top-0 w-[400px] h-[379px] z-10 flex justify-center items-center">
                  <span className="dots-circle-spinner loading2 text-[80px] text-[#FF811C]"></span>
                </div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={props.imageUrl}
                alt="crop image"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  transform: `rotate(${180 - rotate}deg) scale(${scale})`,
                  objectFit: "contain",
                }}
                crossOrigin="anonymous"
                draggable={false}
                onLoad={imageLoadHandler}
                onError={() => setLoading(false)}
              />
            </div>
          </ReactCrop>
          <div style={calculateSafeZoneStyles(crop)} className="absolute"></div>
          <RotateSliderComponent
            className="mt-6 -mb-[18px]"
            rotate={rotate}
            setRotate={rotateChangeHandler}
          />
          <ButtonGroupComponent
            backButtonHandler={props.backHandler}
            nextButtonHandler={nextHandler}
            disabled={false}
            isGenerate={props.isGenerate}
          />
        </div>
      ) : (
        <GenerateErrorComponent
          buttonHandler={() => {
            setProcessing(false);
            props.errorHandler();
          }}
        />
      )}
    </div>
  );
};

export default React.memo(ImageZoomCropComponent);
