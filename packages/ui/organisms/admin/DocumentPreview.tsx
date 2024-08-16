import Image from "next/image";
import React from "react";
import PdfToImage from "./PdfToImage ";

interface Document {
  documentName: string;
  documentLink: string;
  uploadedDate: string;
}

interface DocumentPreview {
  documents: Document[];
}

const ImagePreview: React.FC<{ document: Document; extension: String }> = ({
  document,
  extension,
}) => {
  return (
    <div>
      <div className="h-[200px] rounded-[20px] border-[1px] border-solid pl-4 border-[#E1E1E1] overflow-hidden">
        <Image
          width={200}
          height={150}
          src={document.documentLink}
          alt={document.documentName}
          className="w-full h-[150px] object-cover"
        />
        <div className="flex justify-start gap-2 py-4">
          <Image
            width={20}
            height={20}
            src="/admin/images/icon/file-png-bold.svg"
            alt="png icon"
          />
          <span className="font-medium text-[11px] text-[#1D1F24]">
            {document.documentName}.{extension}
          </span>
        </div>
      </div>
      {/* <p>{document.uploadedDate}</p> */}
      <p className="text-[12px] text-right pt-3 text-[#A5A1A1]">
        8.30 AM - Oct 12, 2022
      </p>
    </div>
  );
};

const PdfPreview: React.FC<{ document: Document }> = ({ document }) => {
  return (
    <div>
      <div className="h-[200px] rounded-[20px] border-[1px] border-solid pl-4 border-[#E1E1E1] overflow-hidden">
        <PdfToImage pdfUrl={document.documentLink} />
        <div className="flex justify-start gap-2 py-4">
          <Image
            width={20}
            height={20}
            src="/admin/images/icon/file-pdf-bold.svg"
            alt="png icon"
          />
          <span className="font-medium text-[11px] text-[#1D1F24]">
            {document.documentName}.pdf
          </span>
        </div>
      </div>
      {/* <p>{document.uploadedDate}</p> */}
      <p className="text-[12px] text-right pt-3 text-[#A5A1A1]">
        8.30 AM - Oct 12, 2022
      </p>
    </div>
  );
};

const getFileExtension = (url: string): string => {
  const urlWithoutQuery = url.split("?")[0];
  const fileName = urlWithoutQuery.substring(
    urlWithoutQuery.lastIndexOf("/") + 1,
  );
  return fileName.split(".").pop() || "";
};

const DocumentPreview: React.FC<DocumentPreview> = ({ documents }) => {
  return (
    <div className="container mx-auto">
      <div className="mt-[95px] p-8 mx-auto border border-[#E0E3E8]">
        <p className="text-[24px] font-semibold text-[#1D1F24] mb-10">
          Documents
        </p>
        <div className="grid grid-cols-4 gap-4 overflow-auto">
          {documents.map((document, index) => {
            const fileExtension = getFileExtension(document.documentLink);
            if (fileExtension === "pdf") {
              return <PdfPreview key={index} document={document} />;
            } else {
              return (
                <ImagePreview
                  key={index}
                  document={document}
                  extension={fileExtension}
                />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
