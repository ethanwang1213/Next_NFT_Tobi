"use client";
import { ImageType, uploadFiles } from "fetchers/UploadActions";
import useRestfulAPI from "hooks/useRestfulAPI";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import ContentReportedNotification from "./ContentReportedNotification";
import DocumentPreview from "./DocumentPreview";
import DocumentUpload from "./DocumentUpload";
import Spinner from "./Spinner";

const ContentSuspendedComponent = () => {
  const [isButtonClicked, setIsButtonClicked] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [documentData, setDocumentData] = useState([]);
  const uploadImageRef = useRef<string>("");
  const postApiUrl = "native/admin/content/documents";
  const getApiUrl = "native/admin/content/documents";
  const { data, loading, getData, postData } = useRestfulAPI(null);

  useEffect(() => {
    const fetchData = async () => {
      if (documentData.length > 0) {
        await apiHandle();
      } else if (documentData.length === 0) {
        await getData(getApiUrl);
      }
    };
    fetchData();
  }, [documentData]);

  const apiHandle = async () => {
    const result = await postData(postApiUrl, { documents: documentData });
    if (result) {
      setDocumentData([]);
    }
    setUploading(false);
  };

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
      setDocumentData((prevFileUrls) => [
        ...prevFileUrls,
        {
          documentLink: uploadImageRef.current,
          documentName: name,
        },
      ]);
      return true;
    },
    [],
  );

  const onDrop = useCallback(
    async (acceptedFiles) => {
      setUploading(true);
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
      ) : uploading || loading ? (
        <Spinner />
      ) : (
        <>
          <DocumentUpload
            onDrop={onDrop}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
          />
          <DocumentPreview documents={data} />
        </>
      )}
    </>
  );
};

export default ContentSuspendedComponent;
