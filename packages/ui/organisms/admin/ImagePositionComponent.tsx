import NextImage from "next/image";
import React, { useCallback, useRef, useState } from "react";
import "react-image-crop/dist/ReactCrop.css";
import ButtonGroupComponent from "./ButtonGroupComponent";
import GenerateErrorComponent from "./GenerateErrorComponent";

type Props = {
  imageUrl: string;
  showDirection?: boolean;
  backHandler: () => void;
  generateHandler: (x: number, y: number) => void;
  error: boolean;
  errorHandler: () => void;
};

const ImagePositionComponent: React.FC<Props> = (props) => {
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [position, setPosition] = useState({ x: 138, y: 185 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  const generateHandler = useCallback(async () => {
    setProcessing(true);
    props.generateHandler(position.x - 138, position.y - 185);
  }, [props, position]);

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
          <div
            className={`relative w-[400px] h-[402px] flex flex-col justify-between items-center mb-[58px]`}
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
                src={props.imageUrl}
                alt="crop image"
                style={{
                  maxWidth: 400,
                  maxHeight: 360,
                  objectFit: "contain",
                }}
                crossOrigin="anonymous"
                draggable={false}
                onLoad={() => setLoading(false)}
              />
            }
            <span className="text-secondary-400 text-sm font-medium">
              Front
            </span>
            <div className="absolute left-0 top-0 w-[400px] h-[402px] z-10 bg-white/50">
              <div
                className="absolute w-[125px] h-8
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
          </div>
          <ButtonGroupComponent
            backButtonHandler={props.backHandler}
            nextButtonHandler={generateHandler}
            disabled={false}
            isGenerate={true}
          />
        </div>
      ) : (
        <GenerateErrorComponent buttonHandler={props.errorHandler} />
      )}
    </div>
  );
};

export default React.memo(ImagePositionComponent);
