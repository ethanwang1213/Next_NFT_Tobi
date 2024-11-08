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

  const contentImageFileRef = useRef(null);
  const stickerImageFileRef = useRef(null);

  const imageCropDlgRef = useRef(null);
  const stickerCropDlgRef = useRef(null);

  const [activeImageFlag, setActiveImageFlag] = useState(false);
  const modifiedRef = useRef(false);

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
        sticker: data.sticker,
      };
      if (submitData.image != dataRef.current.image) {
        submitData.image = await uploadImage(
          submitData.image,
          ImageType.ContentBrand,
        );
      }
      if (submitData.sticker != dataRef.current.sticker) {
        submitData.sticker = await uploadImage(
          submitData.sticker,
          ImageType.ContentBrand,
        );
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
    if (activeImageFlag) {
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

  const checkUploadImage = (flag, width, height) => {
    if (flag) {
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
        if (!checkUploadImage(activeImageFlag, img.width, img.height)) return;
        if (activeImageFlag) {
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
                className="rounded-xl max-w-[320px] max-h-[100px]"
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
          classname="w-[800px]"
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
