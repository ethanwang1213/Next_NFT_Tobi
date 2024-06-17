import NextImage from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { MaterialItem } from "ui/types/adminTypes";
import ButtonGroupComponent from "./ButtonGroupComponent";

type Props = {
  data: MaterialItem[];
  selectedImage: MaterialItem | null;
  selectImageHandler: (value: MaterialItem) => void;
  backHandler: () => void;
  nextHandler: () => void;
  skipHandler?: () => void;
  uploadImageHandler: (image: string) => void;
};

const MaterialImageSelectComponent: React.FC<Props> = (props) => {
  const [processing, setProcessing] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      // Do something with the files
      const file = acceptedFiles[0];
      setProcessing(true);
      if (file && file.type.startsWith("image/png")) {
        await props.uploadImageHandler(URL.createObjectURL(file));
        setProcessing(false);
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          const imageDataUrl = reader.result;
          // Remove EXIF data
          const img = new Image();
          img.onload = async () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const dataUrlWithoutExif = canvas.toDataURL("image/jpeg"); // strip the EXIF data
            await props.uploadImageHandler(dataUrlWithoutExif);
            setProcessing(false);
          };
          img.src = imageDataUrl.toString();
        };
        reader.readAsDataURL(file);
      }
    },
    [props],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="flex flex-col h-full gap-4">
      {processing && (
        <div className="absolute left-0 right-0 top-0 bottom-0 z-10 flex justify-center items-center bg-white/50">
          <span className="dots-circle-spinner loading2 text-[80px] text-[#FF811C]"></span>
        </div>
      )}
      <div
        {...getRootProps()}
        style={{
          width: 400,
          height: 80,
          borderRadius: 13,
          borderStyle: "dashed",
          borderWidth: 2,
          borderColor: "#B3B3B3",
          backgroundColor: isDragActive ? "#B3B3B3" : "transparent",
        }}
        className="flex justify-center items-center gap-3 cursor-pointer"
      >
        <span className="text-secondary-500 text-base font-medium">
          Add New Material
        </span>
        <NextImage
          width={24}
          height={24}
          src="/admin/images/icon/upload-icon.svg"
          alt="upload icon"
        />
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap gap-4 overflow-y-auto">
          {props.data &&
            props.data.map((image) => (
              <NextImage
                key={`material-image-${image.id}`}
                width={88}
                height={88}
                style={{ maxWidth: 88, maxHeight: 88, objectFit: "contain" }}
                src={image.image}
                alt="material image"
                className={`rounded-lg ${
                  props.selectedImage && props.selectedImage.id === image.id
                    ? "border-2 border-[#009FF5]"
                    : ""
                }`}
                onClick={() => {
                  props.selectImageHandler(image);
                }}
              />
            ))}
        </div>
      </div>
      <ButtonGroupComponent
        backButtonHandler={props.backHandler}
        nextButtonHandler={() => {
          setProcessing(true);
          props.nextHandler();
        }}
        skipButtonHandler={
          props.skipHandler
            ? () => {
                setProcessing(true);
                props.skipHandler();
              }
            : null
        }
        disabled={props.selectedImage === null}
      />
    </div>
  );
};

export default React.memo(MaterialImageSelectComponent);
