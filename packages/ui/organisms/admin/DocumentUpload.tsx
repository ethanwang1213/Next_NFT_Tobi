import Image from "next/image";
import React from "react";
import Button from "../../atoms/Button"; // Adjust the import based on your image handling

interface DocumentUploadProps {
  onDrop: (acceptedFiles: File[]) => void;
  getRootProps: () => any;
  getInputProps: () => any;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onDrop,
  getRootProps,
  getInputProps,
}) => {
  return (
    <>
      <div className="m-9 text-[#717171] text-[32px] font-semibold">
        Support Center
      </div>
      <div className="container mx-auto">
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
    </>
  );
};

export default DocumentUpload;
