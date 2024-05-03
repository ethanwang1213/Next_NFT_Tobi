import {
  fetchContentsInformation,
  updateContentsInformation,
} from "fetchers/ContentsActions";
import { auth, firebaseConfig } from "fetchers/firebase/client";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import { initializeApp } from "firebase/app";
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
  const [contentImage, setContentImage] = useState("");
  const contentImageRef = useRef(contentImage);
  const contentImageFileRef = useRef(null);

  const [stickerImage, setStickerImage] = useState("");
  const stickerImageRef = useRef(stickerImage);
  const stickerImageFileRef = useRef(null);

  const [cropImage, setCropImage] = useState("");
  const imageCropDlgRef = useRef(null);

  const [activeImageFlag, setActiveImageFlag] = useState(false);
  const modifiedRef = useRef(false);

  const initImages = () => {
    setContentImage(contentImageRef.current);
    setStickerImage(stickerImageRef.current);
    modifiedRef.current = false;
  };

  // fetch showcases from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchContentsInformation();
        if (data != null) {
          contentImageRef.current = data.image;
          stickerImageRef.current = data.sticker;
          initImages();
        } else {
          toast("Failed to load content information. Please check the error.");
        }
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
        toast(error.toString());
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadImageToFireStorage = async (image) => {
    try {
      if (image == "") return "";

      // Generate a unique filename for the file
      const storageFileName = `${Date.now()}.png`;

      let blob;
      // Check if the image is a Blob object or a base64 string
      if (typeof image === "string" && image.startsWith("blob:")) {
        blob = await fetch(image).then((response) => response.blob());
      } else if (image instanceof Blob) {
        blob = image;
      } else if (typeof image === "string" && image.startsWith("data:image")) {
        // Convert base64 string to Blob
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const byteCharacters = Buffer.from(base64Data, "base64");
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters[i];
        }
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], { type: "image/png" });
      } else {
        toast("Invalid image format");
        return "";
      }

      // Upload the file to Firebase Storage
      const app = initializeApp(firebaseConfig);
      const storage = getStorage(app);
      const storageRef = ref(
        storage,
        `users/${auth.currentUser.uid}/contents/${storageFileName}`,
      );

      await uploadBytes(storageRef, blob);

      // Get the download URL of the uploaded file
      return await getDownloadURL(storageRef);
    } catch (error) {
      // Handle any errors that occur during the upload process
      console.error("Error uploading file:", error);
      toast(error.toString());
      return "";
    }
  };

  const updateData = async () => {
    let image1 = contentImageRef.current;
    if (contentImage != contentImageRef.current) {
      image1 = await uploadImageToFireStorage(contentImage);
    }

    let image2 = stickerImageRef.current;
    if (stickerImage != stickerImageRef.current) {
      image2 = await uploadImageToFireStorage(stickerImage);
    }

    const result = await updateContentsInformation({
      image: image1,
      sticker: image2,
    });
    if (result != null) {
      contentImageRef.current = result.image;
      stickerImageRef.current = result.sticker;
      initImages();
    } else {
      toast("Failed to update the content information. Please check error.");
    }
  };

  useEffect(() => {
    if (cancelFlag > 0 && modifiedRef.current) {
      initImages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancelFlag]);

  useEffect(() => {
    if (publishFlag > 0 && modifiedRef.current) {
      updateData();
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
          setContentImage(imageUrl);
        } else {
          setStickerImage(imageUrl);
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
    <div className="max-w-[800px] min-w-[480px] flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-secondary text-2xl font-bold">Content Image</h2>
        <span className="text-neutral-400 text-xs font-medium py-2">
          For best results, use an image that is at least 320x100 pixels and no
          more than 4MB in size. Accepted file formats are PNG, JPEG or GIF
          (non-animated)
        </span>
        <div className="flex items-end gap-12">
          {contentImage ? (
            <NextImage
              src={contentImage}
              width={260}
              height={260}
              alt="content image"
              className={`rounded-2xl`}
            />
          ) : (
            <div
              style={{ width: 260, height: 260 }}
              className={`rounded-2xl border-2 border-primary-400 border-dashed`}
            ></div>
          )}
          <button
            className="text-xs font-medium text-primary"
            onClick={() => {
              setActiveImageFlag(true);
              if (contentImage) {
                setCropImage(contentImage);
                imageCropDlgRef.current.showModal();
              } else {
                contentImageFileRef.current.click();
              }
            }}
          >
            {contentImage ? "change" : "upload"}
          </button>
          <button
            className="text-xs font-medium text-primary"
            onClick={() => {
              setContentImage("");
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
          For best results, use an image that is at least 500x500 pixels and no
          more than 4MB in size. Accepted file formats are PNG or GIF
          (non-animated).
        </span>
        <div className="flex items-end gap-12">
          <div style={{ width: 260 }}></div>
          <span className="text-secondary text-xs font-medium">Preview</span>
        </div>
        <div className="flex items-end gap-12">
          {stickerImage ? (
            <NextImage
              src={stickerImage}
              width={260}
              height={260}
              alt="sticker image"
              className={`rounded-2xl`}
            />
          ) : (
            <div
              style={{ width: 260, height: 260 }}
              className={`rounded-2xl border-2 border-primary-400 border-dashed`}
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
            {stickerImage && (
              <NextImage
                width={231}
                height={260}
                src={stickerImage}
                alt="sticker"
                className="opacity-25"
              />
            )}
          </div>
          <button
            className="text-xs font-medium text-primary"
            onClick={() => {
              setActiveImageFlag(false);
              if (stickerImage) {
                setCropImage(stickerImage);
                imageCropDlgRef.current.showModal();
              } else {
                stickerImageFileRef.current.click();
              }
            }}
          >
            {stickerImage ? "change" : "upload"}
          </button>
          <button
            className="text-xs font-medium text-primary"
            onClick={() => {
              setStickerImage("");
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
        initialValue={cropImage}
        dialogRef={imageCropDlgRef}
        cropHandler={(image, width, height) => {
          if (activeImageFlag) {
            setContentImage(image);
          } else {
            setStickerImage(image);
          }
          modifiedRef.current = true;
          changeHandler();
        }}
      />
    </div>
  );
};

export { ContentBrandPanel };
