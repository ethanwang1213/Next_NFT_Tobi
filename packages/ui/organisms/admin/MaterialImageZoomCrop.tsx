import NextImage from "next/image";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactCrop, {
  convertToPixelCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { ModelType } from "types/unityTypes";
import Button from "ui/atoms/Button";
import { MaterialItem } from "ui/types/adminTypes";

type Props = {
  materialImage: MaterialItem;
  backHandler: () => void;
  nextHandler: () => void;
  generateHandler: (
    materialId: number,
    cropImage: string,
    sampleType: number,
  ) => void;
  generateError: boolean;
};

const MaterialImageZoomCropComponent: React.FC<Props> = (props) => {
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
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [scale, setScale] = useState(1);

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setIsGenerating(false);
    blobUrlRef.current = null;
  }, [props.materialImage]);

  const imageLoadHandler = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      const initialCrop = convertToPixelCrop(crop, width, height);
      initialCrop.x = (400 - width) / 2;
      initialCrop.y = (352 - height) / 2;

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
    const angleInRadians = (rotate * Math.PI) / 180;
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

  const generateClickHandler = useCallback(async () => {
    setIsGenerating(true);

    await cropHandler();

    props.generateHandler(
      props.materialImage.id,
      blobUrlRef.current,
      ModelType.CanBadge,
    );
  }, [props, cropHandler]);

  const handleCropChange = (newCrop: Crop) => {
    if (imgRef.current) {
      const { width, height } = imgRef.current;

      newCrop.x = (400 - newCrop.width) / 2;
      newCrop.y = (352 - newCrop.height) / 2;
      setCrop(newCrop);

      const newScale =
        newCrop.width / width > newCrop.height / height
          ? newCrop.width / width
          : newCrop.height / height;
      setScale(newScale);
    }
  };

  return (
    <div className="h-full relative">
      {isGenerating && !props.generateError && (
        <div className="absolute left-0 right-0 top-0 bottom-0 z-10 flex justify-center items-center bg-white/50">
          <span className="dots-circle-spinner loading2 text-[80px] text-[#FF811C]"></span>
        </div>
      )}
      {!props.generateError ? (
        <div>
          <ReactCrop
            crop={crop}
            onChange={(c) => {
              handleCropChange(c);
            }}
            onComplete={(c) => setCompletedCrop(c)}
            keepSelection={true}
            aspect={aspect}
          >
            <div className="w-[400px] h-[352px] flex justify-center items-center">
              {
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  ref={imgRef}
                  src={props.materialImage.image}
                  alt="crop image"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    transform: `rotate(${rotate}deg) scale(${scale})`,
                    objectFit: "contain",
                  }}
                  onLoad={imageLoadHandler}
                  crossOrigin="anonymous"
                />
              }
            </div>
          </ReactCrop>
          <div className="mt-6 flex flex-col items-center">
            <div className="w-[220px] relative mt-[18px] mb-[6px]">
              <Slider
                min={-180}
                max={180}
                styles={{
                  handle: {
                    borderColor: "#1779DE",
                    height: 8,
                    width: 8,
                    marginLeft: 0,
                    marginTop: -3,
                    backgroundColor: "#1779DE",
                  },
                  track: {
                    backgroundColor: "#1779DE",
                    height: 2,
                  },
                  rail: {
                    backgroundColor: "#1779DE",
                    height: 2,
                  },
                }}
                value={rotate}
                onChange={(v: number) => setRotate(v)}
              />
              <span className="absolute left-0 -top-2 text-primary-400 text-[8px] font-medium">
                -180
              </span>
              <span className="absolute right-0 -top-2 text-primary-400 text-[8px] font-medium">
                180
              </span>
            </div>
            <NextImage
              width={16}
              height={16}
              src="/admin/images/icon/rotate_right.svg"
              alt="rotate right"
              className={`cursor-pointer rounded`}
            />
          </div>
          <div className="flex justify-between">
            <Button
              className="w-[72px] h-8 rounded-lg border border-primary flex items-center justify-center gap-1"
              onClick={props.backHandler}
            >
              <NextImage
                width={20}
                height={20}
                src="/admin/images/icon/arrow-left-s-line.svg"
                alt="left arrow"
              />
              <span className="text-primary text-sm font-medium">Back</span>
            </Button>
            <Button
              className={`w-[72px] h-8 rounded-lg flex items-center justify-center gap-1 bg-warning`}
              onClick={generateClickHandler}
            >
              <span className="text-base-white text-sm font-medium">
                Generate
              </span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center pt-[152px]">
          <NextImage
            src="/admin/images/icon/report-problem.svg"
            width={98}
            height={98}
            alt="warning"
          />
          <span className="text-error text-sm font-semibold mt-5">
            Something wrong happens...
          </span>
          <Button
            className="w-[140px] h-8 mt-[135px] rounded-lg text-base-white bg-primary text-sm font-medium"
            onClick={() => {
              props.backHandler();
            }}
          >
            Try again
          </Button>
        </div>
      )}
    </div>
  );
};

export default React.memo(MaterialImageZoomCropComponent);
