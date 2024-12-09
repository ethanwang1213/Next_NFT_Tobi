import { useTranslations } from "next-intl";
import NextImage from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import ColorizedSvg from "ui/atoms/ColorizedSvg";
import { MaterialItem } from "ui/types/adminTypes";
import ButtonGroupComponent from "./ButtonGroupComponent";
import GenerateErrorComponent from "./GenerateErrorComponent";

type Props = {
  data: MaterialItem[];
  selectedImage: MaterialItem | null;
  selectImageHandler: (value: MaterialItem) => void;
  backHandler: () => void;
  nextHandler: () => void;
  skipHandler?: () => void;
  uploadImageHandler: (image: string) => void;
  error: boolean;
  errorHandler: () => void;
  deleteHandler: (id: number) => void;
};

const MaterialImageSelectComponent: React.FC<Props> = (props) => {
  const [processing, setProcessing] = useState(false);
  const [images, setImages] = useState<MaterialItem[]>(props.data);
  const [showDelete, setShowDelete] = useState<number | null>(null);
  const deleteButtonRefs = useRef<Map<number, HTMLDivElement | null>>(
    new Map(),
  );
  const deleteDialogRefs = useRef<Map<number, HTMLDivElement | null>>(
    new Map(),
  );
  const t = useTranslations("Workspace");

  useEffect(() => {
    setProcessing(false);
  }, [props.data]);

  const handleDelete = (imageId: number) => {
    setImages((prevImages) =>
      prevImages.filter((image) => image.id !== imageId),
    );
    setShowDelete(null);
    props.deleteHandler(imageId);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      let isClickOutside = true;
      deleteButtonRefs.current.forEach((ref) => {
        if (ref && ref.contains(event.target as Node)) {
          isClickOutside = false;
        }
      });
      deleteDialogRefs.current.forEach((ref) => {
        if (ref && ref.contains(event.target as Node)) {
          isClickOutside = false;
        }
      });

      if (isClickOutside) {
        setShowDelete(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      // Do something with the files
      const file = acceptedFiles[0];
      setProcessing(true);
      if (file && file.type.startsWith("image/png")) {
        props.uploadImageHandler(URL.createObjectURL(file));
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
            props.uploadImageHandler(dataUrlWithoutExif);
          };
          img.src = imageDataUrl.toString();
        };
        reader.readAsDataURL(file);
      }
    },
    [props],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
      "image/bmp": [".bmp"],
    },
    onDrop,
  });

  return (
    <div className="h-full relative">
      {processing && !props.error && (
        <div className="absolute left-0 right-0 top-0 bottom-0 z-10 flex justify-center items-center bg-white/50">
          <span className="dots-circle-spinner loading2 text-[80px] text-[#FF811C]"></span>
        </div>
      )}
      {!props.error ? (
        <div className="h-full">
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
              {t("AddNewMaterial")}
            </span>
            <NextImage
              width={24}
              height={24}
              src="/admin/images/icon/upload-icon.svg"
              alt="upload icon"
            />
          </div>
          <div
            className="h-[348px] my-4 overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="flex flex-wrap gap-4">
              {images &&
                [...images].reverse().map((image, index) => (
                  <div className="relative flex items-center">
                    <NextImage
                      key={`material-image-${image.id}`}
                      width={88}
                      height={88}
                      style={{
                        maxWidth: 88,
                        maxHeight: 88,
                        objectFit: "contain",
                      }}
                      src={image.image}
                      alt="material image"
                      className={`rounded-lg ${
                        props.selectedImage &&
                        props.selectedImage.id === image.id
                          ? "border-2 border-[#009FF5]"
                          : ""
                      }`}
                      onClick={() => {
                        props.selectImageHandler(image);
                      }}
                    />
                    <div
                      className={`group hover:rounded-full hover:bg-[#00000040] p-1 absolute right-0 top-0 ${
                        showDelete === image.id && "bg-[#00000040] rounded-full"
                      }`}
                      ref={(el) => deleteButtonRefs.current.set(image.id, el)}
                      onClick={() =>
                        setShowDelete(showDelete === image.id ? null : image.id)
                      }
                    >
                      <ColorizedSvg
                        url="/admin/images/icon/more-vert-icon.svg"
                        className={`relative w-[16px] h-[16px] cursor-pointer group-hover:bg-white bg-gray-400 transition-colors duration-300 ${
                          showDelete === image.id && "bg-white"
                        }`}
                      />
                    </div>
                    {showDelete === image.id && (
                      <div
                        className={`absolute z-50 ${
                          index % 4 === 3
                            ? "top-[30px] left-0"
                            : "top-[30px] left-[62px]"
                        }`}
                        ref={(el) => deleteDialogRefs.current.set(image.id, el)}
                      >
                        <button
                          className="flex justify-center items-center shadow shadow-custom-light gap-2 bg-white px-4 py-2 rounded-[8px] w-[90px]"
                          onClick={() => handleDelete(image.id)}
                        >
                          <NextImage
                            width={12}
                            height={12}
                            src="/admin/images/icon/delete-icon.svg"
                            alt="delete icon"
                          />
                          <span className="text-[12px] text-[#FF3B30]">
                            {t("Delete")}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
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

export default React.memo(MaterialImageSelectComponent);
