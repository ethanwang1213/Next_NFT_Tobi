import NextImage from "next/image";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import React, { useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  Crop,
  makeAspectCrop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { MaterialItem } from "ui/types/DigitalItems";
import ButtonGroupComponent from "./ButtonGroupComponent";

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

const MaterialImageCropComponent = (props: {
  materialImage: MaterialItem;
  cropHandler: (image: string) => void;
  backHandler: () => void;
  nextHandler: () => void;
}) => {
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

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCompletedCrop(convertToPixelCrop(crop, width, height));
  }

  async function onCropClick() {
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

    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
      type: "image/png",
    });

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob);
    console.log(blobUrlRef.current);
    props.cropHandler(blobUrlRef.current);
  }

  function handleToggleAspectClick(value: number | undefined) {
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
  }

  const handleStyle = {
    borderColor: "#1779DE",
    height: 8,
    width: 8,
    marginLeft: 0,
    marginTop: -3,
    backgroundColor: "#1779DE",
  };

  const trackStyle = {
    backgroundColor: "#1779DE",
    height: 2,
  };

  const railStyle = {
    backgroundColor: "#1779DE",
    height: 2,
  };

  return (
    <div className="h-full">
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
          onLoad={onImageLoad}
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
            onClick={onCropClick}
          />
          <NextImage
            width={24}
            height={24}
            src="/admin/images/icon/crop_16_9.svg"
            alt="crop 16:9"
            className={`cursor-pointer rounded hover:bg-neutral-200
            ${aspect === 9 / 16 ? "bg-neutral-200" : ""}`}
            onClick={() => {
              handleToggleAspectClick(9 / 16);
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
              handleToggleAspectClick(2 / 3);
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
              handleToggleAspectClick(1);
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
              handleToggleAspectClick(undefined);
            }}
          />
        </div>
        <div className="w-[220px] relative mt-[18px] mb-[6px]">
          <Slider
            min={-180}
            max={180}
            styles={{ handle: handleStyle, track: trackStyle, rail: railStyle }}
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
      <ButtonGroupComponent
        backButtonHandler={props.backHandler}
        nextButtonHandler={props.nextHandler}
      />
    </div>
  );
};

export default React.memo(MaterialImageCropComponent);
