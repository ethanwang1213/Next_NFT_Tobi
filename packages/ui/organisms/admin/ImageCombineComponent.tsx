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
    unit: "%",
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

  const calculateNewCropPosition = (dx: number, dy: number) => {
    let newDx = dx;
    let newDy = dy;

    if (crop.x + dx < 0) {
      newDx = -crop.x;
    }

    if (crop.x + crop.width + dx >= imgWrapperRef.current?.clientWidth) {
      newDx = imgWrapperRef.current?.clientWidth - crop.width - crop.x - 1;
    }

    if (crop.y + dy < 0) {
      newDy = -crop.y;
    }

    if (crop.y + crop.height + dy >= imgWrapperRef.current?.clientHeight) {
      newDy = imgWrapperRef.current?.clientHeight - crop.height - crop.y - 1;
    }

    return [newDx, newDy] as const;
  };

  const onMouseDown = useCallback((event: React.MouseEvent) => {
    dragStartPos.current = { x: event.clientX, y: event.clientY };
    setIsDragging(true);
    event.stopPropagation();
  }, []);

  const onMouseMove = (event: React.MouseEvent) => {
    if (isDragging && dragStartPos.current) {
      const dx = event.clientX - dragStartPos.current.x;
      const dy = event.clientY - dragStartPos.current.y;
      const [newDx, newDy] = calculateNewCropPosition(dx, dy);

      setPosition((prevPosition) => ({
        x: prevPosition.x + newDx,
        y: prevPosition.y + newDy,
      }));

      setCrop((prevCrop) => {
        return {
          ...prevCrop,
          x: prevCrop.x + newDx,
          y: prevCrop.y + newDy,
        };
      });
      dragStartPos.current = { x: event.clientX, y: event.clientY };
    }
  };

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStartPos.current = null;
  }, []);

  const imageLoadHandler = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      setLoading(false);

      const { width, height } = e.currentTarget;

      setPosition({
        x: (imgWrapperRef.current?.clientWidth - width) / 2 || 0,
        y: (imgWrapperRef.current?.clientHeight - height) / 2 || 0,
      });

      const initialCrop = convertToPixelCrop(crop, width, height);
      initialCrop.x = (imgWrapperRef.current?.clientWidth - width) / 2 || 0;
      initialCrop.y = (imgWrapperRef.current?.clientHeight - height) / 2 || 0;

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
      if (imgMessageRef.current) {
        const { width, height } = imgMessageRef.current;

        // Recalculate size based on rotation and scale
        const { w: rotatedWidth, h: rotatedHeight } = calcRotatedScaledSize(
          width,
          height,
          180 - rotate,
          scale,
        );

        // Center the rotated image on the canvas
        setCrop((prevCrop) => ({
          ...prevCrop,
          x: position.x + width / 2 - rotatedWidth / 2,
          y: position.y + height / 2 - rotatedHeight / 2,
          width: rotatedWidth,
          height: rotatedHeight,
        }));

        setAspect(rotatedWidth / rotatedHeight);
      }
    },
    [calcRotatedScaledSize, position, scale],
  );

  const cropChangeHandler = useCallback(
    (newCrop: Crop) => {
      if (imgMessageRef.current) {
        const { width, height } = imgMessageRef.current;

        // Calculate crop's new center based on width and height
        newCrop.x = crop.x + (crop.width - newCrop.width) / 2;
        newCrop.y = crop.y + (crop.height - newCrop.height) / 2;
        setCrop(newCrop);

        // Apply correct scaling to the image
        const { w: rotatedWidth, h: rotatedHeight } = calcRotatedScaledSize(
          width,
          height,
          180 - rotate,
          1,
        );

        const newScale = newCrop.width / rotatedWidth;
        setScale(newScale);
      }
    },
    [rotate, crop, calcRotatedScaledSize],
  );

  const combineImage = useCallback(async () => {
    const cardImage = imgCardRef.current;
    const messageImage = imgMessageRef.current;

    if (!cardImage || !messageImage) {
      throw new Error("Images are not available for combining");
    }

    // Get displayed dimensions of the card and message images
    const cardDisplayedWidth = cardImage.clientWidth;
    const cardDisplayedHeight = cardImage.clientHeight;

    const messageDisplayedWidth = messageImage.clientWidth;
    const messageDisplayedHeight = messageImage.clientHeight;

    const cardScaleX = cardImage.naturalWidth / cardDisplayedWidth;
    const cardScaleY = cardImage.naturalHeight / cardDisplayedHeight;
    const messageScaleX = messageImage.naturalWidth / messageDisplayedWidth;
    const messageScaleY = messageImage.naturalHeight / messageDisplayedHeight;

    // Create a canvas to combine the images
    const finalCanvas = document.createElement("canvas");
    const finalCtx = finalCanvas.getContext("2d");

    if (!finalCtx) {
      throw new Error("No 2D context for final image canvas");
    }

    finalCanvas.width = cardImage.naturalWidth;
    finalCanvas.height = cardImage.naturalHeight;

    finalCtx.drawImage(cardImage, 0, 0, finalCanvas.width, finalCanvas.height);

    // Prepare to rotate and scale the message image
    const rotateCanvas = document.createElement("canvas");
    const rotateCtx = rotateCanvas.getContext("2d");

    if (!rotateCtx) {
      throw new Error("No 2D context for rotate canvas");
    }

    const angleInRadians = ((180 - rotate) * Math.PI) / 180;

    // **Apply the scaling factor to the message image size**
    const scaledMessageWidth = messageDisplayedWidth * scale;
    const scaledMessageHeight = messageDisplayedHeight * scale;

    // Calculate the bounding box of the rotated message image
    const rotatedBoundingBox = calcRotatedScaledSize(
      scaledMessageWidth,
      scaledMessageHeight,
      180 - rotate,
      1, // Since scaling is already applied
    );

    // Set rotateCanvas size to handle the rotated and scaled message image
    rotateCanvas.width = rotatedBoundingBox.w * messageScaleX;
    rotateCanvas.height = rotatedBoundingBox.h * messageScaleY;

    // Translate and rotate the canvas for the second image (message)
    rotateCtx.translate(rotateCanvas.width / 2, rotateCanvas.height / 2);
    rotateCtx.rotate(angleInRadians);
    rotateCtx.translate(
      (-scaledMessageWidth * messageScaleX) / 2,
      (-scaledMessageHeight * messageScaleY) / 2,
    );

    // **Draw the scaled and rotated message image on the rotateCanvas**
    rotateCtx.drawImage(
      messageImage,
      0,
      0,
      messageImage.naturalWidth,
      messageImage.naturalHeight,
      0,
      0,
      scaledMessageWidth * messageScaleX,
      scaledMessageHeight * messageScaleY,
    );

    const cardRect = imgCardRef.current.getBoundingClientRect();
    const messageRect = imgMessageRef.current.getBoundingClientRect();
    const rotatedMessageOffsetX =
      (messageRect.left - cardRect.left) * cardScaleX;
    const rotatedMessageOffsetY = (messageRect.top - cardRect.top) * cardScaleY;

    finalCtx.drawImage(
      rotateCanvas,
      0,
      0,
      rotateCanvas.width,
      rotateCanvas.height,
      rotatedMessageOffsetX,
      rotatedMessageOffsetY,
      rotatedBoundingBox.w * cardScaleX,
      rotatedBoundingBox.h * cardScaleY,
    );

    // Convert the final canvas to a blob and store its URL
    const blob = await new Promise<Blob | null>((resolve) =>
      finalCanvas.toBlob(resolve, "image/png"),
    );

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob);
  }, [calcRotatedScaledSize, rotate, scale]);

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
        <div className="absolute left-0 right-0 top-0 bottom-0 z-30 flex justify-center items-center bg-white/50">
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
              className={`w-[400px] h-[385px] overflow-hidden flex justify-center items-center relative bg-gradient-to-r from-secondary to-secondary-200`}
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
                  className="shadow-[0px_0px_5px_rgba(153,153,153,1)]"
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
                    zIndex: 20,
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
