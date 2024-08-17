import Image from "next/image";
import React from "react";
import PdfToImage from "./PdfToImage ";

interface Document {
  documentName: string;
  documentLink: string;
  uploadedTime: string;
}

interface DocumentPreview {
  documents: Document[];
}

const formatDate = (isoString) => {
  const date = new Date(isoString);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const day = date.getUTCDate();
  const month = date.toLocaleString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
  const year = date.getUTCFullYear();
  const formattedHours = hours % 12 || 12;
  const period = hours >= 12 ? "PM" : "AM";
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}.${formattedMinutes} ${period} - ${month} ${day}, ${year}`;
};

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
      <p className="text-[12px] text-right pt-3 text-[#A5A1A1]">
        {formatDate(document.uploadedTime)}
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
      <p className="text-[12px] text-right pt-3 text-[#A5A1A1]">
        {formatDate(document.uploadedTime)}
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
  console.log(documents, "data");
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
