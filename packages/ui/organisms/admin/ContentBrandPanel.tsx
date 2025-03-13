import { ImageType, uploadImage } from "fetchers/UploadActions";
import useRestfulAPI from "hooks/useRestfulAPI";
import { useTranslations } from "next-intl";
import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ImageCropDialog from "./ImageCropDialog";

const ContentBrandPanel = ({
  cancelFlag,
  publishFlag,
  changeHandler,
}: {
  cancelFlag: number;
  publishFlag: number;
  changeHandler: () => void;
}) => {
  const apiUrl = "native/admin/content";
  const { data, dataRef, error, setData, putData, restoreData } =
    useRestfulAPI(apiUrl);
  const t = useTranslations("ContentBrand");

  const contentIconFileRef = useRef(null);
  const contentImageFileRef = useRef(null);
  const stickerImageFileRef = useRef(null);

  const iconCropDlgRef = useRef(null);
  const imageCropDlgRef = useRef(null);
  const stickerCropDlgRef = useRef(null);

  const [activeImageFlag, setActiveImageFlag] = useState(false);
  const [activeIconFlag, setActiveIconFlag] = useState(false);
  const modifiedRef = useRef(false);

  const [tempIconUrlContent, setTempIconUrlContent] = useState(null);
  const [tempImageUrlContent, setTempImageUrlContent] = useState(null);
  const [tempImageUrlSticker, setTempImageUrlSticker] = useState(null);

  useEffect(() => {
    if (cancelFlag > 0 && modifiedRef.current) {
      restoreData();
      modifiedRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancelFlag]);

  useEffect(() => {
    const submitHandler = async () => {
      const submitData = {
        image: data.image,
        icon: data.icon,
        sticker: data.sticker,
      };
      const imageFields = ['image', 'icon', 'sticker'];
      for (const field of imageFields) {
        if (submitData[field] !== dataRef.current[field]) {
          submitData[field] = await uploadImage(submitData[field], ImageType.ContentBrand);
        }
      }
      if (await putData(apiUrl, submitData, [])) {
        modifiedRef.current = false;
      } else {
        toast(error ? error.toString() : "Error submitting data");
      }
    };

    if (publishFlag > 0 && modifiedRef.current) {
      submitHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishFlag]);

  const checkUploadFile = (file) => {
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (activeImageFlag || activeIconFlag) {
      if (!["png", "gif", "jpg", "jpeg"].includes(fileExtension)) {
        toast("Please select PNG, JPEG or GIF(non-animated) file.");
        return false;
      }
    } else {
      if (!["png", "gif"].includes(fileExtension)) {
        toast("Please select PNG or GIF(non-animated) file.");
        return false;
      }
    }
    if (file.size > 4 * 1024 * 1024) {
      toast("Please select a file smaller than 4MB.");
      return false;
    }
    return true;
  };

  const checkUploadImage = (activeImageFlag, activeIconFlag, width, height) => {
    if (activeIconFlag) {
      if (width < 100 || height < 100) {     
        toast("Please select an image of at least 100x100 size.");
        return false;
      }
      return true
    }
    else if (activeImageFlag) {
      if (width < 320 || height < 100) {
        toast("Please select an image of at least 320x100 size.");
        return false;
      }
    } else {
      if (width < 500 || height < 500) {
        toast("Please select an image of at least 500x500 size.");
        return false;
      }
    }
    return true;
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!checkUploadFile(file)) return;
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = function () {
        if (!checkUploadImage(activeImageFlag, activeIconFlag, img.width, img.height)) return;
        if (activeIconFlag) {
          setTempIconUrlContent(imageUrl);
          iconCropDlgRef.current.showModal();
        }
        else if (activeImageFlag) {
          setTempImageUrlContent(imageUrl);
          imageCropDlgRef.current.showModal();
        } else {
          stickerCropDlgRef.current.showModal();
          setTempImageUrlSticker(imageUrl);
        }
        modifiedRef.current = true;
        changeHandler();
      };
      img.src = imageUrl;
    }
    event.target.value = null;
  };

  return (
    data && (
      <div className="max-w-[800px] min-w-[480px] flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-secondary text-2xl font-bold">
            {t("ContentImage")}
          </h2>
          <span className="text-neutral-400 text-xs font-medium py-2">
            {t("ImageGuidelines")}
          </span>
          <div className="flex items-end gap-12">
            {data.image ? (
              <NextImage
                src={data.image}
                width={320}
                height={100}
                alt="content image"
                className="rounded-x1 max-w-[320px] max-h-[100px]"
              />
            ) : (
              <div
                style={{ width: 320, height: 100 }}
                className="rounded-xl border-2 border-primary-400 border-dashed"
              ></div>
            )}
            <button
              className="text-xs font-medium text-primary"
              onClick={() => {
                setActiveImageFlag(true);
                setActiveIconFlag(false);
                if (data.image) {
                  imageCropDlgRef.current.showModal();
                } else {
                  contentImageFileRef.current.click();
                }
              }}
            >
              {data.image ? t("Change") : t("Upload")}
            </button>
            <button
              className="text-xs font-medium text-primary"
              onClick={() => {
                setData({ ...data, ["image"]: "" });
                modifiedRef.current = true;
                changeHandler();
              }}
            >
              {t("Delete")}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-3">
          <h2 className="text-secondary text-2xl font-bold">
            {t("ContentIcon")}
          </h2>
          <span className="text-neutral-400 text-xs font-medium py-2">
            {t("Description")}
          </span>
          <div className="flex items-end gap-12">
            <div className="flex justify-center w-80">
            {data.icon ? (
              <NextImage
                src={data.icon}
                width={100}
                height={100}
                alt="content icon"
                className="rounded-full max-w-[100px] max-h-[100px]"
              />
            ) : (
              <div
                style={{ width: 100, height: 100 }}
                className="rounded-full border-2 border-primary-400 border-dashed"
              ></div>
            )}
            </div>
            <button
              className="text-xs font-medium text-primary"
              onClick={() => {
                setActiveIconFlag(true);
                setActiveImageFlag(false);
                if (data.icon) {
                  iconCropDlgRef.current.showModal();
                } else {
                  contentIconFileRef.current.click();
                }
              }}
            >
              {data.icon ? t("Change") : t("Upload")}
            </button>
            <button
              className="text-xs font-medium text-primary"
              onClick={() => {
                setData({ ...data, ["icon"]: "" });
                modifiedRef.current = true;
                changeHandler();
              }}
            >
              {t("Delete")}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-secondary text-2xl font-bold">
            {t("OfficialMerchandiseSticker")}
          </h2>
          <span className="text-neutral-400 text-xs font-medium py-2">
            {t("MerchandiseImageGuidelines")}
          </span>
          <div className="flex items-end gap-12">
            <div style={{ width: 260 }}></div>
            <span className="text-secondary text-xs font-medium">Preview</span>
          </div>
          <div className="flex items-end gap-12">
            {data.sticker ? (
              <NextImage
                src={data.sticker}
                width={260}
                height={260}
                alt="sticker image"
                className="rounded-xl max-w-[260px] max-h-[260px]"
              />
            ) : (
              <div
                style={{ width: 260, height: 260 }}
                className="rounded-xl border-2 border-primary-400 border-dashed"
              ></div>
            )}
            <div
              style={{
                width: 231,
                height: 260,
                background: `url('/admin/images/png/preview.png') top left no-repeat`,
              }}
              className="flex items-center"
            >
              {data.sticker && (
                <NextImage
                  width={231}
                  height={260}
                  src={data.sticker}
                  alt="sticker"
                  className="opacity-25"
                />
              )}
            </div>
            <button
              className="text-xs font-medium text-primary"
              onClick={() => {
                setActiveImageFlag(false);
                setActiveIconFlag(false);
                if (data.sticker) {
                  stickerCropDlgRef.current.showModal();
                } else {
                  stickerImageFileRef.current.click();
                }
              }}
            >
              {data.sticker ? t("Change") : t("Upload")}
            </button>
            <button
              className="text-xs font-medium text-primary"
              onClick={() => {
                setData({ ...data, ["sticker"]: "" });
                modifiedRef.current = true;
                changeHandler();
              }}
            >
              {t("Delete")}
            </button>
          </div>
        </div>
        <input
          ref={contentIconFileRef}
          type="file"
          accept=".png, .jpg, .jpeg, .gif"
          onChange={(e) => handleFileInputChange(e)}
          className="hidden"
        />
        <input
          ref={contentImageFileRef}
          type="file"
          accept=".png, .jpg, .jpeg, .gif"
          onChange={(e) => handleFileInputChange(e)}
          className="hidden"
        />
        <input
          ref={stickerImageFileRef}
          type="file"
          accept=".png, .gif"
          onChange={(e) => handleFileInputChange(e)}
          className="hidden"
        />
        <ImageCropDialog
          initialValue={data.icon || tempIconUrlContent}
          dialogRef={iconCropDlgRef}
          aspectRatio={1}
          cropHandler={(image) => {
            setData({ ...data, ["icon"]: image });
            modifiedRef.current = true;
            changeHandler();
            setTempIconUrlContent(null);
          }}
          circle={true}
          classname="w-[520px]"
        />
        <ImageCropDialog
          initialValue={data.image || tempImageUrlContent}
          dialogRef={imageCropDlgRef}
          aspectRatio={16 / 5}
          cropHandler={(image) => {
            setData({ ...data, ["image"]: image });
            modifiedRef.current = true;
            changeHandler();
            setTempImageUrlContent(null);
          }}
          circle={false}
        />
        <ImageCropDialog
          initialValue={data.sticker || tempImageUrlSticker}
          dialogRef={stickerCropDlgRef}
          aspectRatio={1}
          cropHandler={(image) => {
            setData({ ...data, ["sticker"]: image });
            modifiedRef.current = true;
            changeHandler();
            setTempImageUrlSticker(null);
          }}
          circle={false}
          classname="w-[520px]"
        />
      </div>
    )
  );
};

export { ContentBrandPanel };
