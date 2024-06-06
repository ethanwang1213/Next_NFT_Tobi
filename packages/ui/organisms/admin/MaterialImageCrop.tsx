import NextImage from "next/image";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  Crop,
  makeAspectCrop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { MaterialItem } from "ui/types/adminTypes";
import Button from "ui/atoms/Button";
import { ModelType } from "types/unityTypes";

type Props = {
  materialImage: MaterialItem;
  cropHandler: (image: string) => void;
  backHandler: () => void;
  nextHandler: () => void;
  generateHandler: (
    materialId: number,
    materialImage: string,
    sampleType: number,
  ) => void;
  generateError: boolean;
};

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 100,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

const MaterialImageCropComponent: React.FC<Props> = (props) => {
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

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setIsGenerating(false);
    blobUrlRef.current = null;
  }, [props.materialImage]);

  const imageLoadHandler = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      setCompletedCrop(convertToPixelCrop(crop, width, height));
    },
    [crop],
  );

  const toggleAspectHandler = useCallback((value: number | undefined) => {
    setAspect(value);
    if (value) {
      if (imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(width, height, value);
        setCrop(newCrop);
        // Updates the preview
        setCompletedCrop(convertToPixelCrop(newCrop, width, height));
      }
    }
  }, []);

  const cropHandler = useCallback(async () => {
    const image = imgRef.current;
    if (!image || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    );

    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
      type: "image/png",
    });

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob);
  }, [completedCrop]);

  const generateClickHandler = useCallback(async () => {
    setIsGenerating(true);

    // check material image
    if (props.materialImage.id === 0 || blobUrlRef.current !== null) {
      // new image
      // upload firebase storage
      if (blobUrlRef.current !== null) {
        props.generateHandler(0, blobUrlRef.current, ModelType.Poster);
      } else if (props.materialImage.id === 0) {
        props.generateHandler(0, props.materialImage.image, ModelType.Poster);
      }
    } else {
      props.generateHandler(
        props.materialImage.id,
        props.materialImage.image,
        ModelType.Poster,
      );
    }
  }, [props]);

  return (
    <div className="h-full relative">
      {isGenerating && !props.generateError && (
        <div className="absolute left-0 right-0 top-0 bottom-0 z-10 flex justify-center items-center bg-white/50">
          <span className="dots-circle-spinner loading2 text-[80px] text-[#FF811C]"></span>
        </div>
      )}
      {!props.generateError ? (
        <div>
          <ReactCrop crop={crop} onChange={(c) => setCrop(c)} aspect={aspect}>
            <NextImage
              ref={imgRef}
              src={props.materialImage.image}
              alt="crop image"
              width={400}
              height={352}
              style={{
                maxWidth: 400,
                maxHeight: 352,
                transform: `rotate(${rotate}deg)`,
                objectFit: "contain",
              }}
              onLoad={imageLoadHandler}
              crossOrigin="anonymous"
            />
          </ReactCrop>
          <div className="mt-6 flex flex-col items-center">
            <div className="flex gap-4">
              <NextImage
                width={24}
                height={24}
                src="/admin/images/icon/crop.svg"
                alt="crop"
                className={`cursor-pointer rounded hover:bg-neutral-200`}
                onClick={cropHandler}
              />
              <NextImage
                width={24}
                height={24}
                src="/admin/images/icon/crop_16_9.svg"
                alt="crop 16:9"
                className={`cursor-pointer rounded hover:bg-neutral-200
              ${aspect === 9 / 16 ? "bg-neutral-200" : ""}`}
                onClick={() => {
                  toggleAspectHandler(9 / 16);
                }}
              />
              <NextImage
                width={24}
                height={24}
                src="/admin/images/icon/crop_3_2.svg"
                alt="crop 3:2"
                className={`cursor-pointer rounded hover:bg-neutral-200
              ${
                Math.floor(aspect * 100) === Math.floor(200 / 3)
                  ? "bg-neutral-200"
                  : ""
              }`}
                onClick={() => {
                  toggleAspectHandler(2 / 3);
                }}
              />
              <NextImage
                width={24}
                height={24}
                src="/admin/images/icon/crop_square.svg"
                alt="crop square"
                className={`cursor-pointer rounded hover:bg-neutral-200
              ${aspect === 1 ? "bg-neutral-200" : ""}`}
                onClick={() => {
                  toggleAspectHandler(1);
                }}
              />
              <NextImage
                width={24}
                height={24}
                src="/admin/images/icon/crop_free.svg"
                alt="crop free"
                className={`cursor-pointer rounded hover:bg-neutral-200
              ${aspect === undefined ? "bg-neutral-200" : ""}`}
                onClick={() => {
                  toggleAspectHandler(undefined);
                }}
              />
            </div>
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
                onChange={(value: number) => setRotate(value)}
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

export default React.memo(MaterialImageCropComponent);
