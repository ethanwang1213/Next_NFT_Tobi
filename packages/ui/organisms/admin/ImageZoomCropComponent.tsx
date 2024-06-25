import "rc-slider/assets/index.css";
import React, { useCallback, useRef, useState } from "react";
import ReactCrop, {
  convertToPixelCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import ButtonGroupComponent from "./ButtonGroupComponent";
import GenerateErrorComponent from "./GenerateErrorComponent";
import RotateSliderComponent from "./RotateSliderComponent";

type Props = {
  imageUrl: string;
  backHandler: () => void;
  nextHandler: (image: string) => void;
  error: boolean;
  errorHandler: () => void;
  isGenerate: boolean;
};

const ImageZoomCropComponent: React.FC<Props> = (props) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const blobUrlRef = useRef("");

  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [crop, setCrop] = useState<Crop>({
    unit: "%", // Can be 'px' or '%'
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });

  const [rotate, setRotate] = useState(180);
  const [scale, setScale] = useState(1);

  const imageLoadHandler = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      setLoading(false);

      const { width, height } = e.currentTarget;

      const initialCrop = convertToPixelCrop(crop, width, height);
      initialCrop.x = (imgWrapperRef.current.clientWidth - width) / 2;
      initialCrop.y = (imgWrapperRef.current.clientHeight - height) / 2;
      setCrop(initialCrop);
    },
    [crop],
  );

  const rotateChangeHandler = useCallback(
    (rotate) => {
      const { width, height } = imgRef.current;

      const angleInRadians = ((180 - rotate) * Math.PI) / 180;
      const sin = Math.abs(Math.sin(angleInRadians));
      const cos = Math.abs(Math.cos(angleInRadians));
      const rotatedScreenWidth = (width * cos + height * sin) * scale;
      const rotateScreenHeight = (width * sin + height * cos) * scale;

      crop.x = (imgWrapperRef.current.clientWidth - rotatedScreenWidth) / 2;
      crop.width = rotatedScreenWidth;
      crop.y = (imgWrapperRef.current.clientHeight - rotateScreenHeight) / 2;
      crop.height = rotateScreenHeight;
      setCrop(crop);

      setRotate(rotate);
    },
    [crop, scale],
  );

  const cropChangeHandler = (newCrop: Crop) => {
    if (imgRef.current) {
      const { width, height } = imgRef.current;

      newCrop.x = (imgWrapperRef.current.clientWidth - newCrop.width) / 2;
      newCrop.y = (imgWrapperRef.current.clientHeight - newCrop.height) / 2;
      setCrop(newCrop);

      const angleInRadians = ((180 - rotate) * Math.PI) / 180;
      const sin = Math.abs(Math.sin(angleInRadians));
      const cos = Math.abs(Math.cos(angleInRadians));
      const rotatedWidth = width * cos + height * sin;
      const rotatedHeight = width * sin + height * cos;
      const newScale =
        newCrop.width / rotatedWidth > newCrop.height / rotatedHeight
          ? newCrop.width / rotatedWidth
          : newCrop.height / rotatedHeight;
      setScale(newScale);
    }
  };

  const cropImage = useCallback(async () => {
    const image = imgRef.current;

    // Create a temporary canvas to draw the rotated image
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    if (!tempCtx) {
      throw new Error("No 2d context for temporary canvas");
    }

    // Calculate the bounding box of the rotated image
    const angleInRadians = ((180 - rotate) * Math.PI) / 180;
    const sin = Math.abs(Math.sin(angleInRadians));
    const cos = Math.abs(Math.cos(angleInRadians));
    const rotatedNaturalWidth =
      image.naturalWidth * cos + image.naturalHeight * sin;
    const rotatedNaturalHeight =
      image.naturalWidth * sin + image.naturalHeight * cos;

    tempCanvas.width = rotatedNaturalWidth;
    tempCanvas.height = rotatedNaturalHeight;

    // Translate and rotate the temporary canvas
    tempCtx.translate(rotatedNaturalWidth / 2, rotatedNaturalHeight / 2);
    tempCtx.rotate(angleInRadians);
    tempCtx.translate(-image.naturalWidth / 2, -image.naturalHeight / 2);

    // Draw the original image onto the temporary canvas
    tempCtx.drawImage(image, 0, 0);

    // Create the final canvas to draw the cropped image
    const finalCanvas = document.createElement("canvas");
    const finalCtx = finalCanvas.getContext("2d");

    if (!finalCtx) {
      throw new Error("No 2d context for final canvas");
    }

    finalCanvas.width = crop.width;
    finalCanvas.height = crop.height;

    // Calculate the crop coordinates based on the rotated image
    const scaleX = image.naturalWidth / image.width / scale;
    const scaleY = image.naturalHeight / image.height / scale;
    const cropX = (rotatedNaturalWidth - crop.width * scaleX) / 2;
    const cropY = (rotatedNaturalHeight - crop.height * scaleY) / 2;

    // Draw the rotated image onto the final canvas
    finalCtx.drawImage(
      tempCanvas,
      cropX,
      cropY,
      rotatedNaturalWidth - cropX * 2,
      rotatedNaturalHeight - cropY * 2,
      0,
      0,
      crop.width,
      crop.height,
    );

    const blob = await new Promise<Blob | null>((resolve) =>
      finalCanvas.toBlob(resolve, "image/png"),
    );

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob);
  }, [crop, rotate, scale]);

  const nextHandler = useCallback(async () => {
    setProcessing(true);

    await cropImage();

    props.nextHandler(blobUrlRef.current);
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
            onChange={(c) => {
              cropChangeHandler(c);
            }}
            keepSelection={true}
          >
            <div
              ref={imgWrapperRef}
              className="w-[400px] h-[379px] flex justify-center items-center"
            >
              {loading && (
                <div className="absolute left-0 top-0 w-[400px] h-[379px] z-10 flex justify-center items-center">
                  <span className="dots-circle-spinner loading2 text-[80px] text-[#FF811C]"></span>
                </div>
              )}
              {
                // eslint-disable-next-line @next/next/no-img-element
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
              }
            </div>
          </ReactCrop>
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
