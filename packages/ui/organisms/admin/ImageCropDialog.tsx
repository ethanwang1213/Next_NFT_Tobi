import NextImage from "next/image";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import ReactCrop, {
  convertToPixelCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ImageCropDialog = ({
  initialValue,
  dialogRef,
  cropHandler,
  aspectRatio,
  initFlag,
}: {
  initialValue: string;
  dialogRef: MutableRefObject<HTMLDialogElement>;
  cropHandler: (value: string) => void;
  aspectRatio: number;
  initFlag: number;
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

  const [imageURL, setImageURL] = useState("");

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCompletedCrop(convertToPixelCrop(crop, width, height));
  }

  useEffect(() => {
    setCrop({
      unit: "%", // Can be 'px' or '%'
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });
  }, [initFlag]);

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

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
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
    cropHandler(blobUrlRef.current);
  }

  useEffect(() => {
    setImageURL(initialValue);
  }, [initialValue]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box w-auto rounded-3xl pt-4 flex flex-col gap-3 relative">
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
          Customize Image
        </div>
        <div className="w-full h-0 border-[0.5px] border-neutral-200"></div>
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          aspect={aspectRatio}
          onComplete={(c) => setCompletedCrop(c)}
        >
          {
            // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
            <img
              ref={imgRef}
              src={imageURL}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
              crossOrigin="anonymous"
              onLoad={onImageLoad}
            />
          }
        </ReactCrop>
        <div className="modal-action flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 bg-base-white rounded-[64px] border-2 border-primary
              hover:shadow-xl hover:-top-[3px] transition-shadow
              text-primary text-sm leading-4 font-semibold"
            onClick={() => dialogRef.current.close()}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-primary rounded-[64px] 
              hover:shadow-xl hover:-top-[3px] transition-shadow  
              text-base-white text-sm leading-4 font-semibold"
            onClick={() => {
              onCropClick();
              dialogRef.current.close();
            }}
          >
            Save changes
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
