import React, { useCallback, useRef, useState } from "react";
import ReactCrop, { convertToPixelCrop, Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import ButtonGroupComponent from "./ButtonGroupComponent";
import GenerateErrorComponent from "./GenerateErrorComponent";
import RotateSliderComponent from "./RotateSliderComponent";

type Props = {
  imageCardUrl: string;
  imageMessageUrl: string;
  backHandler: () => void;
  nextHandler: (image: string) => void;
  error: boolean;
  errorHandler: () => void;
};

const ImageCombineComponent: React.FC<Props> = (props) => {
  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const imgCardRef = useRef<HTMLImageElement>(null);
  const imgMessageRef = useRef<HTMLImageElement>(null);
  const blobUrlRef = useRef(props.imageMessageUrl);

  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [crop, setCrop] = useState<Crop>({
    unit: "%", // Can be 'px' or '%'
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });
  const [aspect, setAspect] = useState<number | undefined>(undefined);

  const [rotate, setRotate] = useState(180);
  const [scale, setScale] = useState(1);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const coordsRef = useRef(null);

  const onMouseDown = useCallback((event: React.MouseEvent) => {
    dragStartPos.current = { x: event.clientX, y: event.clientY };
    setIsDragging(true);
    event.stopPropagation();
  }, []);

  const onMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (isDragging && dragStartPos.current) {
        const dx = event.clientX - dragStartPos.current.x;
        const dy = event.clientY - dragStartPos.current.y;
        setPosition((prevPosition) => ({
          x: prevPosition.x + dx,
          y: prevPosition.y + dy,
        }));

        crop.x += dx;
        crop.y += dy;
        setCrop(crop);

        dragStartPos.current = { x: event.clientX, y: event.clientY };
      }
    },
    [crop, isDragging],
  );

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStartPos.current = null;
  }, []);

  const imageLoadHandler = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      setLoading(false);

      const { width, height } = e.currentTarget;

      setPosition({
        x: (imgWrapperRef.current.clientWidth - width) / 2,
        y: (imgWrapperRef.current.clientHeight - height) / 2,
      });

      const initialCrop = convertToPixelCrop(crop, width, height);
      initialCrop.x = (imgWrapperRef.current.clientWidth - width) / 2;
      initialCrop.y = (imgWrapperRef.current.clientHeight - height) / 2;
      setCrop(initialCrop);
      setAspect(width / height);
    },
    [crop],
  );

  const calcRotatedScaledSize = useCallback(
    (width: number, height: number, angle: number, scale: number) => {
      const angleInRadians = (angle * Math.PI) / 180;
      const sin = Math.abs(Math.sin(angleInRadians));
      const cos = Math.abs(Math.cos(angleInRadians));
      const rotatedScaledWidth = (width * cos + height * sin) * scale;
      const rotatedScaledHeight = (width * sin + height * cos) * scale;
      return { w: rotatedScaledWidth, h: rotatedScaledHeight };
    },
    [],
  );

  const rotateChangeHandler = useCallback(
    (rotate) => {
      setRotate(rotate);

      // set outline crop
      const { width, height } = imgMessageRef.current;
      const { w: rotatedScreenWidth, h: rotatedScreenHeight } =
        calcRotatedScaledSize(width, height, 180 - rotate, scale);
      crop.x = position.x + width / 2 - rotatedScreenWidth / 2;
      crop.width = rotatedScreenWidth;
      crop.y = position.y + height / 2 - rotatedScreenHeight / 2;
      crop.height = rotatedScreenHeight;
      setCrop(crop);
      setAspect(rotatedScreenWidth / rotatedScreenHeight);
    },
    [calcRotatedScaledSize, crop, position, scale],
  );

  const cropChangeHandler = (newCrop: Crop) => {
    if (imgMessageRef.current) {
      const { width, height } = imgMessageRef.current;

      // keep the center of crop rectangle
      newCrop.x = crop.x + (crop.width - newCrop.width) / 2;
      newCrop.y = crop.y + (crop.height - newCrop.height) / 2;
      setCrop(newCrop);

      const { w: rotatedWidth, h: rotatedHeight } = calcRotatedScaledSize(
        width,
        height,
        180 - rotate,
        1,
      );

      const newScale = newCrop.width / rotatedWidth;
      setScale(newScale);
    }
  };

  const combineImage = useCallback(async () => {
    const image = imgMessageRef.current;

    // Create a temporary canvas to draw the rotated image
    const rotateCanvas = document.createElement("canvas");
    const rotateCtx = rotateCanvas.getContext("2d");

    if (!rotateCtx) {
      throw new Error("No 2d context for rotate image canvas");
    }

    // Calculate the bounding box of the rotated image
    const { w: rotatedScreenWidth, h: rotatedScreenHeight } =
      calcRotatedScaledSize(image.width, image.height, 180 - rotate, scale);

    rotateCanvas.width = rotatedScreenWidth;
    rotateCanvas.height = rotatedScreenHeight;

    // Translate and rotate the canvas
    const angleInRadians = ((180 - rotate) * Math.PI) / 180;
    rotateCtx.translate(rotatedScreenWidth / 2, rotatedScreenHeight / 2);
    rotateCtx.rotate(angleInRadians);
    rotateCtx.translate(-image.naturalWidth / 2, -image.naturalHeight / 2);

    // Draw the original image onto the canvas
    rotateCtx.drawImage(image, 0, 0);

    // Create a final canvas to draw the card and message image
    const finalCanvas = document.createElement("canvas");
    const finalCtx = finalCanvas.getContext("2d");

    if (!finalCtx) {
      throw new Error("No 2d context for final image canvas");
    }

    finalCanvas.width = imgCardRef.current.width;
    finalCanvas.height = imgCardRef.current.height;

    // Draw the original card image onto the canvas
    finalCtx.drawImage(imgCardRef.current, 0, 0);

    // Calculate offset
    const cardOffsetX =
      crop.x -
      (imgWrapperRef.current.clientWidth - imgCardRef.current.width) / 2;
    const cardOffsetY =
      crop.y -
      (imgWrapperRef.current.clientHeight - imgCardRef.current.height) / 2;

    // Draw the rotated message image onto the card image
    finalCtx.drawImage(
      rotateCanvas,
      0,
      0,
      rotatedScreenWidth,
      rotatedScreenHeight,
      cardOffsetX,
      cardOffsetY,
      rotatedScreenWidth,
      rotatedScreenHeight,
    );

    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await new Promise<Blob | null>((resolve) =>
      finalCanvas.toBlob(resolve, "image/png"),
    );

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob);
  }, [calcRotatedScaledSize, crop, rotate, scale]);

  const generateHandler = useCallback(async () => {
    setProcessing(true);

    await combineImage();

    props.nextHandler(blobUrlRef.current);
  }, [combineImage, props]);

  return (
    <div
      className="h-full relative"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
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
              cropChangeHandler(c);
            }}
            keepSelection={true}
            aspect={aspect}
          >
            <div
              className={`w-[400px] h-[385px] overflow-hidden flex justify-center items-center relative`}
              ref={imgWrapperRef}
            >
              {loading && (
                <div className="absolute left-0 top-0 w-[400px] h-[385px] z-10 flex justify-center items-center">
                  <span className="dots-circle-spinner loading2 text-[80px] text-[#FF811C]"></span>
                </div>
              )}
              {
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  ref={imgCardRef}
                  src={props.imageCardUrl}
                  alt="card image"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                  crossOrigin="anonymous"
                  draggable={false}
                  onError={() => setLoading(false)}
                />
              }
              {
                // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                <img
                  ref={imgMessageRef}
                  src={props.imageMessageUrl}
                  style={{
                    position: "absolute",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    transform: `rotate(${180 - rotate}deg) scale(${scale})`,
                    objectFit: "contain",
                    left: position.x,
                    top: position.y,
                    zIndex: 1,
                  }}
                  crossOrigin="anonymous"
                  draggable={false}
                  onLoad={imageLoadHandler}
                  onError={() => setLoading(false)}
                  onMouseDown={onMouseDown}
                  className="cursor-move"
                />
              }
            </div>
          </ReactCrop>
          <RotateSliderComponent
            className="mt-4 -mb-4"
            rotate={rotate}
            setRotate={rotateChangeHandler}
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

export default React.memo(ImageCombineComponent);
