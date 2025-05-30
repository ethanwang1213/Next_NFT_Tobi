import React, { useCallback, useRef, useState } from "react";
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
};

const ImageRotateComponent: React.FC<Props> = (props) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const blobUrlRef = useRef(props.imageUrl);

  const [rotate, setRotate] = useState(180);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  const cropImage = useCallback(async () => {
    const image = imgRef.current;

    // Create a temporary canvas to draw the rotated image
    const rotateCanvas = document.createElement("canvas");
    const rotateCtx = rotateCanvas.getContext("2d");

    if (!rotateCtx) {
      throw new Error("No 2d context for rotate image canvas");
    }

    // Calculate the bounding box of the rotated image
    const angleInRadians = ((180 - rotate) * Math.PI) / 180;
    const sin = Math.abs(Math.sin(angleInRadians));
    const cos = Math.abs(Math.cos(angleInRadians));
    const rotatedNaturalWidth =
      image.naturalWidth * cos + image.naturalHeight * sin;
    const rotatedNaturalHeight =
      image.naturalWidth * sin + image.naturalHeight * cos;

    rotateCanvas.width = rotatedNaturalWidth;
    rotateCanvas.height = rotatedNaturalHeight;

    // Translate and rotate the canvas
    rotateCtx.translate(rotatedNaturalWidth / 2, rotatedNaturalHeight / 2);
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
          <div
            className={`w-[400px] h-[402px] flex justify-center items-center relative`}
            ref={imgWrapperRef}
          >
            {loading && (
              <div className="absolute left-0 top-0 w-[400px] h-[402px] z-10 flex justify-center items-center">
                <span className="dots-circle-spinner loading2 text-[80px] text-[#FF811C]"></span>
              </div>
            )}
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={imgRef}
                src={props.imageUrl}
                alt="image"
                style={{
                  maxWidth: "100%",
                  maxHeight: 352,
                  transform: `rotate(${180 - rotate}deg)`,
                  objectFit: "contain",
                }}
                crossOrigin="anonymous"
                draggable={false}
                onLoad={() => setLoading(false)}
                onError={() => setLoading(false)}
              />
            }
          </div>
          <RotateSliderComponent
            className="mt-1 -mb-4"
            rotate={rotate}
            setRotate={setRotate}
          />
          <ButtonGroupComponent
            backButtonHandler={props.backHandler}
            nextButtonHandler={nextHandler}
            disabled={false}
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

export default React.memo(ImageRotateComponent);
