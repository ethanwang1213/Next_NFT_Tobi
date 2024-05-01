import {
  fetchContentsInformation,
  updateContentsInformation,
} from "fetchers/ContentsActions";
import { auth, firebaseConfig } from "fetchers/firebase/client";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
// import ImageCropDialog from "./ImageCropDialog";
import { initializeApp } from "firebase/app";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageCropDialog from "./ImageCropDialog";

const emptyImageSize = 240;
const maxImageSize = 400;

const ContentBrandPanel = ({
  cancelFlag,
  publishFlag,
  changeHandler,
}: {
  cancelFlag: number;
  publishFlag: number;
  changeHandler: () => void;
}) => {
  const [contentsInfo, setContentsInfo] = useState(null);
  const [contentImage, setContentImage] = useState({
    image: null,
    w: emptyImageSize,
    h: emptyImageSize,
  });
  const [stickerImage, setStickerImage] = useState({
    image: null,
    w: emptyImageSize,
    h: emptyImageSize,
  });
  const [cropImage, setCropImage] = useState("");
  const [activeImageFlag, setActiveImageFlag] = useState(false);
  const [modified, setModified] = useState(false);

  const imageFileRef = useRef(null);
  const imageCropDlgRef = useRef(null);

  // fetch showcases from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchContentsInformation();
        if (data != null) {
          setContentsInfo(data);
          setPreviewImage(true, data.image);
          setPreviewImage(false, data.sticker);
        } else {
          toastErrorMessage(
            "Failed to load content information. Please check the error.",
          );
        }
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
        toastErrorMessage(error.toString());
      }
    };

    fetchData();
  }, []);

  const uploadImageToFireStorage = async (image) => {
    try {
      // Generate a unique filename for the file
      const storageFileName = `${Date.now()}.png`;

      // Upload the file to Firebase Storage
      const app = initializeApp(firebaseConfig);
      const storage = getStorage(app);
      const storageRef = ref(
        storage,
        `users/${auth.currentUser.uid}/contents/${storageFileName}`,
      );

      await uploadBytes(storageRef, image);

      // Get the download URL of the uploaded file
      return await getDownloadURL(storageRef);
    } catch (error) {
      // Handle any errors that occur during the upload process
      console.error("Error uploading file:", error);
      return "";
    }
  };

  const updateData = async () => {
    let image1 = contentImage.image;
    if (image1 != contentsInfo.image) {
      image1 = await uploadImageToFireStorage(image1);
    }

    let image2 = stickerImage.image;
    if (image2 != contentsInfo.sticker) {
      image2 = await uploadImageToFireStorage(image2);
    }

    const result = await updateContentsInformation({
      image: image1,
      sticker: image2,
    });
    if (result != null) {
      setContentsInfo({
        ...contentsInfo,
        ["image"]: image1,
        ["sticker"]: image2,
      });
    }
  };

  useEffect(() => {
    if (modified) {
      setPreviewImage(true, contentsInfo.image);
      setPreviewImage(false, contentsInfo.sticker);
      setModified(false);
    }
  }, [cancelFlag]);

  useEffect(() => {
    if (modified) {
      updateData();
      setModified(false);
    }
  }, [publishFlag]);

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

  const setPreviewImage = (flag, imageUrl) => {
    if (imageUrl == "") {
      onImageChangeHandler(flag, imageUrl, emptyImageSize, emptyImageSize);
    } else {
      const img = new Image();
      img.onload = function () {
        if (!checkUploadImage(img.width, img.height)) return;
        onImageChangeHandler(flag, imageUrl, img.width, img.height);
      };
      img.src = imageUrl;
    }
  };

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
        toastErrorMessage("Please select PNG, JPEG or GIF(non-animated) file.");
        return false;
      }
    } else {
      if (fileExtension !== "png" && fileExtension !== "gif") {
        toastErrorMessage("Please select PNG or GIF(non-animated) file.");
        return false;
      }
    }
    if (file.size > 4 * 1024 * 1024) {
      toastErrorMessage("Please select file smaller than 4MB.");
      return false;
    }

    return true;
  };

  const checkUploadImage = (width, height) => {
    // Get the file extension
    if (activeImageFlag) {
      if (width < 320 || height < 100) {
        toastErrorMessage("Please select image at least 320x100 size.");
        return false;
      }
    } else {
      if (width < 500 || height < 500) {
        toastErrorMessage("Please select image at least 320x100 size.");
        return false;
      }
    }

    return true;
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    // Check if a file is selected
    if (file) {
      // Get the file extension
      if (!checkUploadFile(file)) return;

      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(activeImageFlag, imageUrl);
      changeHandler();
      setModified(true);
    }
  };

  const onImageChangeHandler = (flag, image, width, height) => {
    if (flag) {
      setContentImage({ image, ...calcPreviewImageSize(width, height) });
    } else {
      setStickerImage({ image, ...calcPreviewImageSize(width, height) });
    }
  };

  const toastErrorMessage = (value: string) => {
    toast(value, {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      // transition: Bounce,
    });
  };

  return (
    <div className="max-w-[800px] min-w-[480px] flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-secondary text-2xl font-bold">Content Image</h2>
        <span className="text-neutral-400 text-xs font-medium py-2">
          For best results, use an image that is at least 320x100 pixels and no
          more than 4MB in size. Accepted file formats are PNG, JPEG or GIF
          (non-animated)
        </span>
        <div className="flex items-end gap-12">
          <div
            style={{ width: contentImage.w, height: contentImage.h }}
            className={`
              rounded-2xl border-2 border-primary-400
              ${contentImage.image ? "border-none" : "border-dashed"}`}
          >
            {contentImage.image && (
              <NextImage
                src={contentImage.image}
                width={contentImage.w}
                height={contentImage.h}
                alt="Selected Image"
                className={`rounded-2xl`}
              />
            )}
          </div>
          <button
            className="text-xs font-medium text-primary"
            onClick={() => {
              setActiveImageFlag(true);
              if (!contentImage.image) {
                imageFileRef.current.click();
              } else {
                setCropImage(contentImage.image);
                imageCropDlgRef.current.showModal();
              }
            }}
          >
            {!contentImage.image ? "upload" : "change"}
          </button>
          <button
            className="text-xs font-medium text-primary"
            onClick={() => {
              setPreviewImage(true, "");
              changeHandler();
              setModified(true);
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
            style={{ width: stickerImage.w, height: stickerImage.h }}
            className={`
              rounded-2xl border-2 border-primary-400
              ${stickerImage.image ? "border-none" : "border-dashed"}`}
          >
            {stickerImage.image && (
              <NextImage
                src={stickerImage.image}
                width={stickerImage.w}
                height={stickerImage.h}
                alt="Selected Image"
                className={`rounded-2xl`}
              />
            )}
          </div>
          <button
            className="text-xs font-medium text-primary"
            onClick={() => {
              setActiveImageFlag(false);
              if (!stickerImage.image) {
                imageFileRef.current.click();
              } else {
                setCropImage(stickerImage.image);
                imageCropDlgRef.current.showModal();
              }
            }}
          >
            {!stickerImage.image ? "upload" : "change"}
          </button>
          <button
            className="text-xs font-medium text-primary"
            onClick={() => {
              setPreviewImage(false, "");
              changeHandler();
              setModified(true);
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
        initialValue={cropImage}
        dialogRef={imageCropDlgRef}
        cropHandler={(image, width, height) => {
          onImageChangeHandler(activeImageFlag, image, width, height);
          changeHandler();
          setModified(true);
        }}
      />
      <ToastContainer />
    </div>
  );
};

export { ContentBrandPanel };
