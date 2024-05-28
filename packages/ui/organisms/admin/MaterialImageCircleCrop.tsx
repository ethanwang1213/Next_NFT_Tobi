import NextImage from "next/image";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import React, { useRef, useState } from "react";
import { centerCrop, Crop, makeAspectCrop, PixelCrop } from "react-image-crop";
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

const MaterialImageCircleCropComponent = (props: {
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
      <div className="h-[350px] flex justify-center items-center">
        <NextImage
          ref={imgRef}
          src="/admin/images/sample-thumnail/badge.png"
          alt="crop image"
          width={247}
          height={247}
          style={{
            maxWidth: 247,
            maxHeight: 247,
            transform: `rotate(${rotate}deg)`,
            objectFit: "contain",
          }}
        />
      </div>
      <div className="mt-6 flex flex-col items-center mb-6">
        <div className="w-[220px] relative mt-[24px] mb-[6px]">
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

export default React.memo(MaterialImageCircleCropComponent);
