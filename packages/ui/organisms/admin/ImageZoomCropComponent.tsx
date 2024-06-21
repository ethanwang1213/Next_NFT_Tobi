import "rc-slider/assets/index.css";
import React, { useCallback, useRef, useState } from "react";
import ReactCrop, {
  convertToPixelCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { MaterialItem } from "ui/types/adminTypes";
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
  const blobUrlRef = useRef("");
  const [crop, setCrop] = useState<Crop>({
    unit: "%", // Can be 'px' or '%'
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [rotate, setRotate] = useState(180);
  const [scale, setScale] = useState(1);

  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  const imageLoadHandler = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      setLoading(false);

      const { width, height } = e.currentTarget;
      const initialCrop = convertToPixelCrop(crop, width, height);
      initialCrop.x = (400 - width) / 2;
      initialCrop.y = (379 - height) / 2;

      setCompletedCrop(initialCrop);
      setCrop(initialCrop);
    },
    [crop],
  );

  const cropHandler = useCallback(async () => {
    const image = imgRef.current;
    if (!image || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }

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
    const rotatedWidth = image.naturalWidth * cos + image.naturalHeight * sin;
    const rotatedHeight = image.naturalWidth * sin + image.naturalHeight * cos;

    tempCanvas.width = rotatedWidth;
    tempCanvas.height = rotatedHeight;

    // Translate and rotate the temporary canvas
    tempCtx.translate(rotatedWidth / 2, rotatedHeight / 2);
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

    finalCanvas.width = completedCrop.width;
    finalCanvas.height = completedCrop.height;

    // Calculate the crop coordinates based on the rotated image
    const scaleX = image.naturalWidth / image.width / scale;
    const scaleY = image.naturalHeight / image.height / scale;
    const cropX = (rotatedWidth - completedCrop.width * scaleX) / 2;
    const cropY = (rotatedHeight - completedCrop.height * scaleY) / 2;

    // Draw the rotated image onto the final canvas
    finalCtx.drawImage(
      tempCanvas,
      cropX,
      cropY,
      rotatedWidth - cropX * 2,
      rotatedHeight - cropY * 2,
      0,
      0,
      completedCrop.width,
      completedCrop.height,
    );

    const blob = await new Promise<Blob | null>((resolve) =>
      finalCanvas.toBlob(resolve, "image/png"),
    );

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob);
  }, [completedCrop, rotate, scale]);

  const nextHandler = useCallback(async () => {
    setProcessing(true);

    await cropHandler();

    props.nextHandler(blobUrlRef.current);
  }, [props, cropHandler]);

  const handleCropChange = (newCrop: Crop) => {
    if (imgRef.current) {
      const { width, height } = imgRef.current;

      newCrop.x = (400 - newCrop.width) / 2;
      newCrop.y = (379 - newCrop.height) / 2;
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
              handleCropChange(c);
            }}
            onComplete={(c) => setCompletedCrop(c)}
            keepSelection={true}
          >
            <div className="w-[400px] h-[379px] flex justify-center items-center">
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
            setRotate={setRotate}
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
