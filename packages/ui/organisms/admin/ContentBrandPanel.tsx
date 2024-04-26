import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import ImageCropDialog from "./ImageCropDialog";

const emptyImageSize = 240;
const maxImageSize = 400;

const ContentBrandPanel = () => {
  const [contentImageUrl, setContentImageUrl] = useState("");
  const [contentImageSize, setContentImageSize] = useState({
    w: emptyImageSize,
    h: emptyImageSize,
  });
  const [stickerImageUrl, setStickerImageUrl] = useState("");
  const [stickerImageSize, setStickerImageSize] = useState({
    w: emptyImageSize,
    h: emptyImageSize,
  });
  const [cropImageURL, setCropImageURL] = useState("");
  const [cropImageFlag, setCropImageFlag] = useState(false);

  const imageFileRef = useRef(null);
  const imageCropDlgRef = useRef(null);

  // fetch showcases from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const data = await fetchShowcases();
        // setShowcases(data);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const calcPreviewImageSize = (width, height) => {
    if (width > maxImageSize || height > maxImageSize) {
      if (width > height) {
        return {
          w: maxImageSize,
          h: (maxImageSize * height) / width,
        };
      } else {
        return {
          w: (maxImageSize * width) / height,
          h: maxImageSize,
        };
      }
    } else {
      return { w: width, h: height };
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    // Check if a file is selected
    if (file) {
      // Get the file extension
      const fileExtension = file.name.split(".").pop().toLowerCase();
      // Check if the file extension is 'png' or 'gif'
      if (fileExtension === "png" || fileExtension === "gif") {
        const imageUrl = URL.createObjectURL(file);
        const img = new Image();
        img.onload = function () {
          onImageCropHandler(imageUrl, img.width, img.height);
        };
        img.src = imageUrl;
      } else {
        // File is not PNG or GIF, show an error message or handle accordingly
        console.log("Please select a PNG or GIF file.");
      }
    }
  };

  const onImageCropHandler = (image, width, height) => {
    if (cropImageFlag) {
      setContentImageSize(calcPreviewImageSize(width, height));
      setContentImageUrl(image);
    } else {
      setStickerImageSize(calcPreviewImageSize(width, height));
      setStickerImageUrl(image);
    }
  };

  return (
    <div className="max-w-[800px] min-w-[480px] flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-secondary text-2xl font-bold">Content Image</h2>
        <span className="text-neutral-400 text-xs font-medium py-2">
          You can change the image of the content.
        </span>
        <div className="flex items-end gap-12">
          <div
            style={{ width: contentImageSize.w, height: contentImageSize.h }}
            className={`
              rounded-2xl border-2 border-primary-400
              ${contentImageUrl ? "border-none" : "border-dashed"}`}
          >
            {contentImageUrl && (
              <NextImage
                src={contentImageUrl}
                width={contentImageSize.w}
                height={contentImageSize.h}
                alt="Selected Image"
                className={`rounded-2xl`}
              />
            )}
          </div>
          <button
            className="text-xs font-medium text-primary"
            onClick={() => {
              setCropImageFlag(true);
              if (!contentImageUrl) {
                imageFileRef.current.click();
              } else {
                setCropImageURL(contentImageUrl);
                imageCropDlgRef.current.showModal();
              }
            }}
          >
            {!contentImageUrl ? "upload" : "change"}
          </button>
          <button
            className="text-xs font-medium text-primary"
            onClick={() => {
              setContentImageSize({ w: emptyImageSize, h: emptyImageSize });
              setContentImageUrl("");
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
          For best results, use an image that is at least 500x500 pixels and no
          more than 4MB in size. Accepted file formats are PNG or GIF
          (non-animated).
        </span>
        <div className="flex items-end gap-12">
          <div
            style={{ width: stickerImageSize.w, height: stickerImageSize.h }}
            className={`
              rounded-2xl border-2 border-primary-400
              ${stickerImageUrl ? "border-none" : "border-dashed"}`}
          >
            {stickerImageUrl && (
              <NextImage
                src={stickerImageUrl}
                width={stickerImageSize.w}
                height={stickerImageSize.h}
                alt="Selected Image"
                className={`rounded-2xl`}
              />
            )}
          </div>
          <button
            className="text-xs font-medium text-primary"
            onClick={() => {
              setCropImageFlag(false);
              if (!stickerImageUrl) {
                imageFileRef.current.click();
              } else {
                setCropImageURL(stickerImageUrl);
                imageCropDlgRef.current.showModal();
              }
            }}
          >
            {!stickerImageUrl ? "upload" : "change"}
          </button>
          <button
            className="text-xs font-medium text-primary"
            onClick={() => {
              setStickerImageSize({ w: emptyImageSize, h: emptyImageSize });
              setStickerImageUrl("");
            }}
          >
            delete
          </button>
        </div>
      </div>
      <input
        ref={imageFileRef}
        type="file"
        accept=".png, .gif"
        onChange={(e) => handleFileInputChange(e)}
        className="hidden"
      />
      <ImageCropDialog
        initialValue={cropImageURL}
        dialogRef={imageCropDlgRef}
        changeHandler={onImageCropHandler}
      />
    </div>
  );
};

export { ContentBrandPanel };
