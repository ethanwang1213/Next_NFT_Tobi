import "cropperjs/dist/cropper.css";
import Image from "next/image";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";

const ImageCropDialog = ({
  initialValue,
  dialogRef,
  cropHandler,
}: {
  initialValue: string;
  dialogRef: MutableRefObject<HTMLDialogElement>;
  cropHandler: (value: string, width: number, height: number) => void;
}) => {
  const [imageURL, setImageURL] = useState("");

  const cropperRef = useRef<ReactCropperElement>(null);
  const onCrop = () => null;

  useEffect(() => {
    setImageURL(initialValue);
  }, [initialValue]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-[827px] rounded-3xl pt-4 flex flex-col gap-3 relative">
        <form method="dialog">
          <button className="absolute w-4 h-4 top-4 right-4">
            <Image
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
        <Cropper
          src={imageURL}
          style={{ height: 400, width: "100%" }}
          // Cropper.js options
          initialAspectRatio={16 / 9}
          guides={false}
          crop={onCrop}
          ref={cropperRef}
        />
        <div className="modal-action flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 bg-primary rounded-[64px] 
              text-base-white text-sm leading-4 font-semibold"
            onClick={() => {
              const cropper = cropperRef.current?.cropper;
              // Get the cropped canvas
              const croppedCanvas = cropper.getCroppedCanvas();
              cropHandler(
                croppedCanvas.toDataURL(),
                croppedCanvas.width,
                croppedCanvas.height,
              );
              dialogRef.current.close();
            }}
          >
            Save changes
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-base-white rounded-[64px] border-2 border-primary
              text-primary text-sm leading-4 font-semibold"
            onClick={() => dialogRef.current.close()}
          >
            Cancel
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
