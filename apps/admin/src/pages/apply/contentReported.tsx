"use client";
import { getMessages } from "admin/messages/messages";
import { ImageType, uploadFiles } from "fetchers/UploadActions";
import useRestfulAPI from "hooks/useRestfulAPI";
import { GetStaticPropsContext } from "next";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import ContentReportedNotification from "ui/organisms/admin/ContentReportedNotification";
import DocumentPreview from "ui/organisms/admin/DocumentPreview";
import DocumentUpload from "ui/organisms/admin/DocumentUpload";
import Spinner from "ui/organisms/admin/Spinner";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}

const ContentReported = () => {
  const [isButtonClicked, setIsButtonClicked] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [documentData, setDocumentData] = useState([]);
  const uploadImageRef = useRef<string>("");
  const apiUrl = "native/admin/content/documents";
  const { data, loading, getData, postData } = useRestfulAPI(null);

  useEffect(() => {
    const fetchData = async () => {
      const apiHandle = async () => {
        const result = await postData(apiUrl, { documents: documentData });
        if (result) {
          setDocumentData([]);
        }
        setUploading(false);
      };
      if (documentData.length > 0) {
        await apiHandle();
      } else if (documentData.length === 0) {
        await getData(apiUrl);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentData]);

  const uploadImageHandler = useCallback(
    async (
      image: string,
      name: string,
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

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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

export default ContentReported;
