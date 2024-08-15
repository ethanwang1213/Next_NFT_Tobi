"use client";
import { ImageType, uploadFiles } from "fetchers/UploadActions";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import ContentReportedNotification from "./ContentReportedNotification";
import DocumentUpload from "./DocumentUpload";
import Spinner from "./Spinner";

const ContentSuspendedComponent = () => {
  const [isButtonClicked, setIsButtonClicked] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fileUrls, setFileUrls] = useState([]);
  const uploadImageRef = useRef<string>("");

  const uploadImageHandler = useCallback(
    async (
      image: string,
      name: String,
      extension: string,
    ): Promise<boolean> => {
      uploadImageRef.current = await uploadFiles(
        image,
        extension,
        ImageType.ContentDocument,
      );
      if (uploadImageRef.current === "") {
        return false;
      }
      setFileUrls((prevFileUrls) => [
        ...prevFileUrls,
        {
          documentUrl: uploadImageRef.current,
          documentName: name,
        },
      ]);
      return true;
    },
    [],
  );

  const onDrop = useCallback(
    async (acceptedFiles) => {
      setLoading(true);
      for (const file of acceptedFiles) {
        const fileName = file.name.split(".")[0];
        const fileExtension = file.type.split("/")[1];
        if (
          file &&
          (fileExtension === "png" ||
            fileExtension === "jpeg" ||
            fileExtension === "pdf")
        ) {
          const fileUrl = URL.createObjectURL(file);
          await uploadImageHandler(fileUrl, fileName, fileExtension);
        }
      }
      setLoading(false);
    },
    [uploadImageHandler],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleButtonClick = () => {
    setIsButtonClicked(false);
  };

  return (
    <>
      {isButtonClicked ? (
        <ContentReportedNotification onButtonClick={handleButtonClick} />
      ) : loading ? (
        <Spinner />
      ) : (
        <DocumentUpload
          onDrop={onDrop}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
        />
      )}
    </>
  );
};

export default ContentSuspendedComponent;
