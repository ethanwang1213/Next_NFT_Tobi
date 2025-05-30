import { useTranslations } from "next-intl";
import NextImage from "next/image";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactCrop, {
  convertToPixelCrop,
  Crop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ImageCropDialog = ({
  initialValue,
  dialogRef,
  cropHandler,
  aspectRatio,
  circle,
  classname,
}: {
  initialValue: string;
  dialogRef: MutableRefObject<HTMLDialogElement>;
  cropHandler: (value: string) => void;
  aspectRatio: number | null;
  circle: boolean | null;
  classname?: string;
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const blobUrlRef = useRef("");
  const [crop, setCrop] = useState<Crop>(null);
  const [imageURL, setImageURL] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const t = useTranslations("ContentSettings");
  const b = useTranslations("GiftReceivingSettings");

  const calculateCrop = (width, height) => {
    if (!imgWrapperRef.current) return;
    let newCrop;
    if (aspectRatio) {
      newCrop = makeAspectCrop(
        { unit: "%", width: 100 },
        aspectRatio,
        width,
        height,
      );
    } else {
      newCrop = { unit: "%", x: 0, y: 0, width: 100, height: 100 };
    }
    newCrop = convertToPixelCrop(newCrop, width, height);
    newCrop.x = (imgWrapperRef.current.clientWidth - newCrop.width) / 2;
    newCrop.y = (imgWrapperRef.current.clientHeight - newCrop.height) / 2;
    setCrop(newCrop);
  };

  useEffect(() => {
    if (initialValue) {
      setImageURL(initialValue);
      const img = imgRef.current;
      if (img && img.complete) {
        const { width, height } = img;
        calculateCrop(width, height);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue, aspectRatio]);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      calculateCrop(width, height);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [aspectRatio],
  );

  const onCropChange = useCallback((c: Crop) => {
    setCrop(c);
  }, []);

  const cropImage = useCallback(async () => {
    const image = imgRef.current;
    if (!image || !crop) {
      throw new Error("Crop canvas does not exist");
    }

    const { clientWidth, clientHeight } = imgWrapperRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      crop.width * scaleX,
      crop.height * scaleY,
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }
    const offsetX = crop.x - (clientWidth - image.width) / 2;
    const offsetY = crop.y - (clientHeight - image.height) / 2;

    ctx.drawImage(
      image,
      offsetX * scaleX,
      offsetY * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY,
    );

    const blob = await offscreen.convertToBlob({
      type: "image/png",
    });

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob);
    cropHandler(blobUrlRef.current);
  }, [crop, cropHandler]);

  useEffect(() => {
    setImageURL(initialValue);
  }, [initialValue]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dragStart) {
      setDragStart({ x: e.clientX, y: e.clientY });
    }
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragStart || !imgRef.current || !imgWrapperRef.current)
        return;
  
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
  
      const wrapper = imgWrapperRef.current;
      const image = imgRef.current;
  
      const wrapperWidth = wrapper.clientWidth;
      const wrapperHeight = wrapper.clientHeight;
      const imageWidth = image.width;
      const imageHeight = image.height;
  
      const offsetX = (wrapperWidth - imageWidth) / 2;
      const offsetY = (wrapperHeight - imageHeight) / 2;
  
      const minX = offsetX;
      const minY = offsetY;
      const maxX = offsetX + imageWidth - crop.width;
      const maxY = offsetY + imageHeight - crop.height;
  
      let newX = crop.x + dx;
      let newY = crop.y + dy;
  
      // ✅ Clamp to image area
      newX = Math.max(minX, Math.min(newX, maxX));
      newY = Math.max(minY, Math.min(newY, maxY));
  
      setCrop({ ...crop, x: newX, y: newY });
      setDragStart({ x: e.clientX, y: e.clientY });
    },
    [isDragging, dragStart, crop],
  );

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div
        className={`modal-box max-w-[800px] h-[520px] rounded-3xl pt-4 flex flex-col gap-3 relative ${classname}`}
      >
        <form method="dialog">
          <button className="absolute w-4 h-4 top-4 right-4">
            <NextImage
              src="/admin/images/icon/close2.svg"
              width={16}
              height={16}
              alt="close icon"
            />
          </button>
        </form>
        <div className="text-base-black text-lg font-semibold">
          {t("CustomizeImage")}
        </div>
        <ReactCrop
          crop={crop}
          onChange={(c) => onCropChange(c)}
          aspect={aspectRatio}
          keepSelection={true}
          circularCrop={circle}
        >
          <div
            ref={imgWrapperRef}
            className="w-full h-[360px] flex justify-center items-center border-neutral-200"
            onMouseDown={handleMouseDown}
          >
            {
              // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
              <img
                ref={imgRef}
                src={imageURL}
                style={{
                  maxWidth: "100%",
                  maxHeight: "360px",
                  objectFit: "contain",
                }}
                crossOrigin="anonymous"
                onLoad={onImageLoad}
              />
            }
          </div>
        </ReactCrop>
        <div className="flex justify-end gap-4 pt-1">
          <button
            type="button"
            className="px-4 py-2 bg-base-white rounded-[64px] border-2 border-primary
              hover:shadow-xl hover:-top-[3px] transition-shadow
              text-primary text-sm leading-4 font-semibold"
            onClick={() => dialogRef.current.close()}
          >
            {t("Cancel")}
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-primary rounded-[64px] 
              hover:shadow-xl hover:-top-[3px] transition-shadow  
              text-base-white text-sm leading-4 font-semibold"
            onClick={() => {
              cropImage();
              dialogRef.current.close();
            }}
          >
            {b("SaveChanges")}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ImageCropDialog;
