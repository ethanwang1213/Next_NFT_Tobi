import { ImageType, uploadImage } from "fetchers/UploadActions";
import useRestfulAPI from "hooks/useRestfulAPI";
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

  const contentImageFileRef = useRef(null);
  const stickerImageFileRef = useRef(null);

  const imageCropDlgRef = useRef(null);
  const stickerCropDlgRef = useRef(null);

  const [activeImageFlag, setActiveImageFlag] = useState(false);
  const modifiedRef = useRef(false);

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
        if (error) {
          if (error instanceof String) {
            toast(error);
          } else {
            toast(error.toString());
          }
        }
      }
    };

    if (publishFlag > 0 && modifiedRef.current) {
      submitHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishFlag]);

  const checkUploadFile = (file) => {
    // Get the file extension
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (activeImageFlag) {
      if (
        fileExtension !== "png" &&
        fileExtension !== "gif" &&
        fileExtension !== "jpg" &&
        fileExtension !== "jpeg"
      ) {
        toast("Please select PNG, JPEG or GIF(non-animated) file.");
        return false;
      }
    } else {
      if (fileExtension !== "png" && fileExtension !== "gif") {
        toast("Please select PNG or GIF(non-animated) file.");
        return false;
      }
    }
    if (file.size > 4 * 1024 * 1024) {
      toast("Please select file smaller than 4MB.");
      return false;
    }

    return true;
  };

  const checkUploadImage = (flag, width, height) => {
    // Get the file extension
    if (flag) {
      if (width < 320 || height < 100) {
        toast("Please select image at least 320x100 size.");
        return false;
      }
    } else {
      if (width < 500 || height < 500) {
        toast("Please select image at least 500x500 size.");
        return false;
      }
    }

    return true;
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    // Check if a file is selected
    if (file) {
      // check the file type
      if (!checkUploadFile(file)) return;

      // check the image size
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = function () {
        if (!checkUploadImage(activeImageFlag, img.width, img.height)) return;
        if (activeImageFlag) {
          setData({ ...data, ["image"]: imageUrl });
        } else {
          setData({ ...data, ["sticker"]: imageUrl });
        }
        modifiedRef.current = true;
        changeHandler();
      };
      img.src = imageUrl;
    }
    // reset input tag value
    event.target.value = null;
  };

  return (
    data && (
      <div className="max-w-[800px] min-w-[480px] flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-secondary text-2xl font-bold">Content Image</h2>
          <span className="text-neutral-400 text-xs font-medium py-2">
            For best results, use an image that is at least 320x100 pixels and
            no more than 4MB in size. Accepted file formats are PNG, JPEG or GIF
            (non-animated)
          </span>
          <div className="flex items-end gap-12">
            {data.image ? (
              <NextImage
                src={data.image}
                width={320}
                height={100}
                alt="content image"
                className={`rounded-xl max-w-[320px] max-h-[100px]`}
              />
            ) : (
              <div
                style={{ width: 320, height: 100 }}
                className={`rounded-xl border-2 border-primary-400 border-dashed`}
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
              {data.image ? "change" : "upload"}
            </button>
            <button
              className="text-xs font-medium text-primary"
              onClick={() => {
                setData({ ...data, ["image"]: "" });
                modifiedRef.current = true;
                changeHandler();
              }}
            >
              delete
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-secondary text-2xl font-bold">
            Official Merchandise Sticker
          </h2>
          <span className="text-neutral-400 text-xs font-medium py-2">
            For best results, use an image that is at least 500x500 pixels and
            no more than 4MB in size. Accepted file formats are PNG or GIF
            (non-animated).
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
                className={`rounded-xl max-w-[260px] max-h-[260px]`}
              />
            ) : (
              <div
                style={{ width: 260, height: 260 }}
                className={`rounded-xl border-2 border-primary-400 border-dashed`}
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
              {data.sticker ? "change" : "upload"}
            </button>
            <button
              className="text-xs font-medium text-primary"
              onClick={() => {
                setData({ ...data, ["sticker"]: "" });
                modifiedRef.current = true;
                changeHandler();
              }}
            >
              delete
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
          initialValue={data.image}
          dialogRef={imageCropDlgRef}
          aspectRatio={16 / 5}
          cropHandler={(image) => {
            setData({ ...data, ["image"]: image });
            modifiedRef.current = true;
            changeHandler();
          }}
        />
        <ImageCropDialog
          initialValue={data.sticker}
          dialogRef={stickerCropDlgRef}
          aspectRatio={null}
          cropHandler={(image) => {
            setData({ ...data, ["sticker"]: image });
            modifiedRef.current = true;
            changeHandler();
          }}
        />
      </div>
    )
  );
};

export { ContentBrandPanel };
