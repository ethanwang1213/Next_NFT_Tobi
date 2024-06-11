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
      setCompletedCrop(convertToPixelCrop(crop, width, height));
      setCrop(convertToPixelCrop(crop, width, height));
    },
    [crop],
  );

  const cropHandler = useCallback(async () => {
    const image = imgRef.current;
    if (!image || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }

    // // This will size relative to the uploaded image
    // // size. If you want to size according to what they
    // // are looking at on screen, remove scaleX + scaleY
    // const scaleX = image.naturalWidth / image.width;
    // const scaleY = image.naturalHeight / image.height;

    // const offscreen = new OffscreenCanvas(
    //   completedCrop.width,
    //   completedCrop.height,
    // );
    // const ctx = offscreen.getContext("2d");
    // if (!ctx) {
    //   throw new Error("No 2d context");
    // }

    // ctx.drawImage(
    //   image,
    //   completedCrop.x * scaleX,
    //   completedCrop.y * scaleY,
    //   completedCrop.width * scaleX,
    //   completedCrop.height * scaleY,
    //   0,
    //   0,
    //   completedCrop.width,
    //   completedCrop.height,
    // );

    // // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // // reduce image size
    // const blob = await offscreen.convertToBlob({
    //   type: "image/png",
    // });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    ctx.translate(cropWidth / 2, cropHeight / 2);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.translate(-cropWidth / 2, -cropHeight / 2);
    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight,
    );

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob);
  }, [completedCrop]);

  const generateClickHandler = useCallback(async () => {
    setIsGenerating(true);

    await cropHandler();

    props.generateHandler(
      props.materialImage.id,
      blobUrlRef.current,
      ModelType.Poster,
    );
  }, [props, cropHandler]);

  const handleCropChange = (newCrop: Crop) => {
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      newCrop.x = (width - newCrop.width) / 2;
      newCrop.y = (height - newCrop.height) / 2;
      setCrop(newCrop);

      setScale(
        newCrop.width / width > newCrop.height / height
          ? newCrop.width / width
          : newCrop.height / height,
      );
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
            aspect={aspect}
          >
            <NextImage
              ref={imgRef}
              src={props.materialImage.image}
              alt="crop image"
              width={400}
              height={352}
              style={{
                maxWidth: 400,
                maxHeight: 352,
                transform: `rotate(${rotate}deg) scale(${scale})`,
                objectFit: "contain",
              }}
              onLoad={imageLoadHandler}
              crossOrigin="anonymous"
            />
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
