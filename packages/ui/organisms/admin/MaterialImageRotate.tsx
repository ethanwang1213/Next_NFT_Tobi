import NextImage from "next/image";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { ModelType } from "types/unityTypes";
import Button from "ui/atoms/Button";
import { MaterialItem } from "ui/types/adminTypes";

type Props = {
  materialImage: MaterialItem;
  cropHandler: (image: string) => void;
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

const MaterialImageRotateComponent: React.FC<Props> = (props) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const blobUrlRef = useRef("");
  const [rotate, setRotate] = useState(0);

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setIsGenerating(false);
    blobUrlRef.current = null;
  }, [props.materialImage]);

  const cropHandler = useCallback(async () => {
    const image = imgRef.current;

    // Create a temporary canvas to draw the rotated image
    const rotateCanvas = document.createElement("canvas");
    const rotateCtx = rotateCanvas.getContext("2d");

    if (!rotateCtx) {
      throw new Error("No 2d context for rotate image canvas");
    }

    // Calculate the bounding box of the rotated image
    const angleInRadians = (rotate * Math.PI) / 180;
    const sin = Math.abs(Math.sin(angleInRadians));
    const cos = Math.abs(Math.cos(angleInRadians));
    const rotatedWidth = image.naturalWidth * cos + image.naturalHeight * sin;
    const rotatedHeight = image.naturalWidth * sin + image.naturalHeight * cos;

    rotateCanvas.width = rotatedWidth;
    rotateCanvas.height = rotatedHeight;

    // Translate and rotate the canvas
    rotateCtx.translate(rotatedWidth / 2, rotatedHeight / 2);
    rotateCtx.rotate(angleInRadians);
    rotateCtx.translate(-image.naturalWidth / 2, -image.naturalHeight / 2);

    // Draw the original image onto the canvas
    rotateCtx.drawImage(image, 0, 0);

    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await new Promise<Blob | null>((resolve) =>
      rotateCanvas.toBlob(resolve, "image/png"),
    );

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob);
  }, [rotate]);

  const generateClickHandler = useCallback(async () => {
    setIsGenerating(true);

    await cropHandler();

    props.generateHandler(
      props.materialImage.id,
      blobUrlRef.current,
      ModelType.Poster,
    );
  }, [props, cropHandler]);

  return (
    <div className="h-full relative">
      {isGenerating && !props.generateError && (
        <div className="absolute left-0 right-0 top-0 bottom-0 z-10 flex justify-center items-center bg-white/50">
          <span className="dots-circle-spinner loading2 text-[80px] text-[#FF811C]"></span>
        </div>
      )}
      {!props.generateError ? (
        <div>
          <div
            className="w-[400px] h-[352px] flex justify-center items-center"
            ref={imgWrapperRef}
          >
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={imgRef}
                src={props.materialImage.image}
                alt="crop image"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  transform: `rotate(${rotate}deg)`,
                  objectFit: "contain",
                }}
                crossOrigin="anonymous"
                draggable={false}
              />
            }
          </div>
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

export default React.memo(MaterialImageRotateComponent);
