import NextImage from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "react-image-crop/dist/ReactCrop.css";
import ButtonGroupComponent from "./ButtonGroupComponent";
import GenerateErrorComponent from "./GenerateErrorComponent";
import RotateSliderComponent from "./RotateSliderComponent";

type Props = {
  imageUrl: string;
  backHandler: () => void;
  nextHandler: (image: string, coords: string) => void;
  error: boolean;
  errorHandler: () => void;
};

const ImagePositionComponent: React.FC<Props> = (props) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const moverWrapperRef = useRef<HTMLDivElement>(null);
  const blobUrlRef = useRef(props.imageUrl);

  const [rotate, setRotate] = useState(180);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const coordsRef = useRef(null);

  useEffect(() => {
    if (imgWrapperRef.current && moverWrapperRef.current) {
      setPosition({
        x:
          (imgWrapperRef.current.clientWidth -
            moverWrapperRef.current.clientWidth) /
          2,
        y:
          (imgWrapperRef.current.clientWidth -
            moverWrapperRef.current.clientHeight) /
          2,
      });
    }
  }, [imgWrapperRef, moverWrapperRef]);

  const onMouseDown = (event: React.MouseEvent) => {
    dragStartPos.current = { x: event.clientX, y: event.clientY };
    setIsDragging(true);
  };

  const onMouseMove = (event: React.MouseEvent) => {
    if (isDragging && dragStartPos.current) {
      const dx = event.clientX - dragStartPos.current.x;
      const dy = event.clientY - dragStartPos.current.y;
      setPosition((prevPosition) => ({
        x: prevPosition.x + dx,
        y: prevPosition.y + dy,
      }));
      dragStartPos.current = { x: event.clientX, y: event.clientY };
    }
  };

  const onMouseUp = () => {
    setIsDragging(false);
    dragStartPos.current = null;
  };

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

  const calculatePositionHandler = useCallback(() => {
    const image = imgRef.current;
    const angleInRadians = ((180 - rotate) * Math.PI) / 180;
    const sin = Math.abs(Math.sin(angleInRadians));
    const cos = Math.abs(Math.cos(angleInRadians));
    const rotatedNaturalWidth =
      image.naturalWidth * cos + image.naturalHeight * sin;
    const rotatedNaturalHeight =
      image.naturalWidth * sin + image.naturalHeight * cos;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const rotatedScreenWidth = rotatedNaturalWidth / scaleX;
    const rotatedScreenHeight = rotatedNaturalHeight / scaleY;

    const screenOffsetX =
      position.x +
      moverWrapperRef.current.clientWidth / 2 -
      (imgWrapperRef.current.clientWidth - rotatedScreenWidth) / 2;
    const screenOffsetY =
      position.y +
      moverWrapperRef.current.clientHeight / 2 -
      (imgWrapperRef.current.clientHeight - rotatedScreenHeight) / 2;
    const offsetX = Math.round(screenOffsetX * scaleX);
    const offsetY = Math.round(screenOffsetY * scaleY);
    coordsRef.current = `${offsetX},${offsetY}`;
  }, [rotate, position]);

  const generateHandler = useCallback(async () => {
    setProcessing(true);
    if (rotate !== 180) {
      await cropImage();
    }

    if (
      position.x !=
        (imgWrapperRef.current.clientWidth -
          moverWrapperRef.current.clientWidth) /
          2 ||
      position.y !=
        (imgWrapperRef.current.clientWidth -
          moverWrapperRef.current.clientHeight) /
          2
    ) {
      calculatePositionHandler();
    }

    props.nextHandler(blobUrlRef.current, coordsRef.current);
  }, [props, rotate, position, cropImage, calculatePositionHandler]);

  return (
    <div
      className="h-full relative"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {processing && !props.error && (
        <div className="absolute left-0 right-0 top-0 bottom-0 z-20 flex justify-center items-center bg-white/50">
          <span className="dots-circle-spinner loading2 text-[80px] text-[#FF811C]"></span>
        </div>
      )}
      {!props.error ? (
        <div>
          <div
            className={`w-[400px] h-[402px] flex flex-col items-center justify-between relative`}
            ref={imgWrapperRef}
          >
            {loading && (
              <div className="absolute left-0 top-0 w-[400px] h-[402px] z-10 flex justify-center items-center">
                <span className="dots-circle-spinner loading2 text-[80px] text-[#FF811C]"></span>
              </div>
            )}
            <span className="text-secondary-400 text-sm font-medium">Back</span>
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={imgRef}
                src={props.imageUrl}
                alt="crop image"
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
            <span className="text-secondary-400 text-sm font-medium">
              Front
            </span>
            <div
              ref={moverWrapperRef}
              className="absolute w-[124px] h-8 z-10
                  bg-white rounded-lg border border-primary flex justify-center items-center gap-1 cursor-move"
              style={{ left: position.x, top: position.y }}
              onMouseDown={onMouseDown}
            >
              <span className="text-primary text-sm font-medium">
                Acrylic Plate
              </span>
              <NextImage
                src="/admin/images/icon/drag_pan.svg"
                width={20}
                height={20}
                alt="image"
              ></NextImage>
            </div>
          </div>
          <RotateSliderComponent
            className="mt-1 -mb-4"
            rotate={rotate}
            setRotate={setRotate}
          />
          <ButtonGroupComponent
            backButtonHandler={props.backHandler}
            nextButtonHandler={generateHandler}
            disabled={false}
            isGenerate={true}
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

export default React.memo(ImagePositionComponent);
