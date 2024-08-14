"use client";
import { ImageType, uploadFiles } from "fetchers/UploadActions";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import Button from "../../atoms/Button";

const ContentSuspendedComponent = () => {
  const [isButtonClicked, setIsButtonClicked] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fileUrls, setFileUrls] = useState([]);
  const uploadImageRef = useRef<string>("");

  // const apiUrl = "native/admin/content/documents";
  // const { data, postData } = useRestfulAPI(apiUrl);

  const onDrop = useCallback(async (acceptedFiles) => {
    setLoading(true);
    for (const file of acceptedFiles) {
      const fileExtension = file.type.split("/")[1]; // Get the file extension from MIME type
      if (
        file &&
        (fileExtension === "png" ||
          fileExtension === "jpeg" ||
          fileExtension === "pdf")
      ) {
        const fileUrl = URL.createObjectURL(file);
        await uploadImageHandler(fileUrl, fileExtension);
      }
    }
    setLoading(false);
  }, []);

  const uploadImageHandler = useCallback(
    async (image: string, extension: string): Promise<boolean> => {
      uploadImageRef.current = await uploadFiles(
        image,
        extension,
        ImageType.ContentDocument,
      );
      if (uploadImageRef.current === "") {
        return false;
      }
      fileUrls.push(uploadImageRef.current);
      console.log(fileUrls);
      return true;
    },
    [],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleButtonClick = () => {
    setIsButtonClicked(false);
  };

  return (
    <>
      {isButtonClicked ? (
        <div className="mt-10 px-20">
          <div className="py-[37px] px-[32px] bg-[#FF4747] mx-auto rounded-[20px] font-sans">
            <div className="text-[#fff] border-l-[3px] border-[#fff] pl-4">
              <p className="text-[24px] font-semibold">
                Your content has been reported.
              </p>
              <p className="text-[14px] my-6 font-medium">
                Your content has been temporarily frozen due to a reported issue
                with your content.<br></br>
                For more details, please contact us at:
                <Link href="#">TCP-support@tobiratory.com</Link>
              </p>
              <Button
                className="px-3 py-4 rounded-[8px] bg-[#fff] text-[#717171] font-[13px] font-medium"
                onClick={handleButtonClick}
              >
                Submit additional documentation here
              </Button>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <div className="w-[400px] h-[379px] z-10 flex justify-center items-center">
            <span className="dots-circle-spinner loading2 text-[80px] text-[#FF811C]"></span>
          </div>
        </div>
      ) : (
        <>
          <div className="m-9 text-[#717171] text-[32px] font-semibold">
            Support Center
          </div>
          <div className="px-20">
            <div className="font-semibold bg-[#E0E3E8] rounded-[20px] mx-auto">
              <div className="mt-[62px]">
                <div className="text-[20px] text-[#1D1F24] font-medium pt-[95px] pb-[30px] space-y-1">
                  <p className="text-[20px] font-medium text-[#1D1F24] text-center">
                    Document Upload
                  </p>
                  <p className="text-[14px] text-[#6B6E75] text-center">
                    Additional information may be required to resolve the issue.
                    Please submit the necessary documents using the form below.
                  </p>
                  <div className="flex justify-center flex-wrap text-center gap-1">
                    <Image
                      src="/admin/images/info-icon-2.svg"
                      width={16}
                      height={16}
                      alt="info icon"
                      className="cursor-pointer"
                    />
                    <span className="text-[#6B6E75] text-[11px] ">
                      You can submit official documents to prove copyright or
                      licensing.
                    </span>
                  </div>
                </div>
                <div className="pb-[55px]" {...getRootProps()}>
                  <Button className="py-[10px] px-[14px] bg-[#1779DE] rounded-md flex justify-center text-[13px] text-[#fff] gap-1 items-center mx-auto">
                    <Image
                      src="/admin/images/icon/add-icon.svg"
                      width={18}
                      height={18}
                      alt="add icon"
                      className="cursor-pointer"
                    />{" "}
                    add document
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="px-20">
            <div className="mt-[95px] p-8 mx-auto border border-[#E0E3E8]">
              <p className="text-[24px] font-semibold text-[#1D1F24]">
                Document
              </p>
              <div className="grid gird-cols-4"></div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ContentSuspendedComponent;
