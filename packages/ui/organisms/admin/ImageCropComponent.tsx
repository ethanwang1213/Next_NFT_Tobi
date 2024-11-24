import NextImage from "next/image";
import "rc-slider/assets/index.css";
import React, { useCallback, useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  Crop,
  makeAspectCrop,
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
  isShowCropButtons: boolean;
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
  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const blobUrlRef = useRef(props.imageUrl);
  const [crop, setCrop] = useState<Crop>({
    unit: "%", // Can be 'px' or '%'
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });
  const [rotate, setRotate] = useState(180);
  const [aspect, setAspect] = useState<number | undefined>(undefined);

  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const toggleAspectHandler = useCallback((value: number | undefined) => {
    setAspect(value);
    if (value) {
      if (imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(width, height, value);
        const newPixelCrop = convertToPixelCrop(
          newCrop,
          imgWrapperRef.current.clientWidth,
          imgWrapperRef.current.clientHeight,
        );
        setCrop(newPixelCrop);
      }
    }
  }, []);

  const cropImage = useCallback(async () => {
    const image = imgRef.current;
    if (!image || crop.unit === "%") {
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

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(crop.width, crop.height);
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    let sx, sy, sw, sh, dx, dy;
    sx = (imgWrapperRef.current.clientWidth - rotatedNaturalWidth / scaleX) / 2;
    sy =
      (imgWrapperRef.current.clientHeight - rotatedNaturalHeight / scaleY) / 2;
    sw = rotatedNaturalWidth / scaleX;
    sh = rotatedNaturalHeight / scaleY;
    sw = Math.min(sx + sw, crop.x + crop.width) - Math.max(sx, crop.x);
    sh = Math.min(sy + sh, crop.y + crop.height) - Math.max(sy, crop.y);
    if (sx < crop.x) {
      sx = crop.x - sx;
      dx = 0;
    } else {
      dx = sx - crop.x;
      sx = 0;
    }
    if (sy < crop.y) {
      sy = crop.y - sy;
      dy = 0;
    } else {
      dy = sy - crop.y;
      sy = 0;
    }

    const swScaled = sw * scaleX;
    const shScaled = sh * scaleY;

    offscreen.width = swScaled;
    offscreen.height = shScaled;

    ctx.drawImage(
      tempCanvas,
      sx * scaleX,
      sy * scaleY,
      swScaled,
      shScaled,
      dx,
      dy,
      swScaled,
      shScaled,
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
  }, [crop, rotate]);

  const nextHandler = useCallback(async () => {
    setProcessing(true);

    if (rotate != 180 || blobUrlRef.current === null) {
      await cropImage();
    }

    props.nextHandler(blobUrlRef.current);
  }, [cropImage, props, rotate]);

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
              blobUrlRef.current = null;
              setCrop(c);
            }}
            aspect={aspect}
            keepSelection={true}
          >
            <div
              className={`w-[400px] ${
                props.isShowCropButtons ? "h-[352px]" : "h-[376px]"
              } flex justify-center items-center`}
              ref={imgWrapperRef}
            >
              {loading && (
                <div className="absolute left-0 right-0 top-0 bottom-0 z-10 flex justify-center items-center">
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
                    transform: `rotate(${180 - rotate}deg)`,
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
          <div className="mt-2 flex flex-col items-center">
            {props.isShowCropButtons && (
              <div className="flex gap-4">
                <NextImage
                  width={24}
                  height={24}
                  src="/admin/images/icon/crop.svg"
                  alt="crop"
                  className={`cursor-pointer rounded hover:bg-neutral-200`}
                  onClick={cropImage}
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
            )}
            <RotateSliderComponent
              className="mt-[18px] -mb-[18px]"
              rotate={rotate}
              setRotate={setRotate}
            />
          </div>
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

export default React.memo(MaterialImageCropComponent);
