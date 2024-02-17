import Image from "next/image";
import { useRef, useState } from "react";
import FloatingButton from "ui/atoms/FloatingButton";
import { OptionMark } from "ui/atoms/Marks";

const CopyrightInformation = ({ copyrightInfo, setCopyrightInfo }) => {
  const copyrightInfoChangeHandler = (field, e) => {
    setCopyrightInfo({ ...copyrightInfo, [field]: e.target.checked });
  };

  const [filePath1, setFilePath1] = useState("");
  const [filePath2, setFilePath2] = useState("");
  const [filePath3, setFilePath3] = useState("");
  const [filePath4, setFilePath4] = useState("");

  // const [file1, setFile1] = useState(null);
  // const [file2, setFile2] = useState(null);
  // const [file3, setFile3] = useState(null);
  // const [file4, setFile4] = useState(null);

  const file1InputRef = useRef(null);
  const file2InputRef = useRef(null);
  const file3InputRef = useRef(null);
  const file4InputRef = useRef(null);

  const handleFileChange = (field, e) => {
    const selectedFile = e.target.files[0];
    switch (field) {
      case 1:
        // setFile1(selectedFile);
        setFilePath1(selectedFile.name);
        break;
      case 2:
        // setFile2(selectedFile);
        setFilePath2(selectedFile.name);
        break;
      case 3:
        // setFile3(selectedFile);
        setFilePath3(selectedFile.name);
        break;
      case 4:
        // setFile4(selectedFile);
        setFilePath4(selectedFile.name);
        break;

      default:
        break;
    }
  };

  // const handleUpload = () => {
  //   // Handle file upload logic here
  //   if (file) {
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     // Make a POST request to your server with the formData
  //     // Example: fetch('/api/upload', { method: 'POST', body: formData });
  //   }
  // };

  return (
    <div className="text-title-color">
      <div className="mb-16 ">
        <span className="text-2xl mr-10">著作権情報</span>
      </div>
      <div className="mb-4 flex flex-row items-center">
        <span className="text-base ml-4 mr-8">
          所有している著作権やライセンス情報の提供
        </span>
        <OptionMark />
      </div>
      <div className="mb-12 flex flex-row items-center">
        <Image
          src="/admin/images/info-icon-2.svg"
          width={16}
          height={16}
          alt="information"
          className="ml-4"
        />
        <span className="text-[12px] ml-4">
          著作権やライセンスを証明する公式文書を提出できます。
        </span>
      </div>
      {/* TODO: ファイルアップロードのボタンはコンポーネント化する */}
      <div className="flex flex-row items-center mb-6">
        <input
          className="hidden"
          type="file"
          ref={file1InputRef}
          onChange={(e) => handleFileChange(1, e)}
        />
        <span className="flex-1 text-title-color">{filePath1}</span>
        <FloatingButton
          className="flex-0 w-36 h-8 bg-transparent border rounded-lg border-normal-color text-[10px]"
          onClick={() => file1InputRef.current.click()}
        >
          ファイルアップロード
        </FloatingButton>
      </div>
      <div className="flex flex-row items-center mb-6">
        <input
          className="hidden"
          type="file"
          ref={file2InputRef}
          onChange={(e) => handleFileChange(2, e)}
        />
        <span className="flex-1 text-title-color">{filePath2}</span>
        <FloatingButton
          className="flex-0 w-36 h-8 bg-transparent border rounded-lg border-normal-color text-[10px]"
          onClick={() => file2InputRef.current.click()}
        >
          ファイルアップロード
        </FloatingButton>
      </div>
      <div className="flex flex-row items-center mb-6">
        <input
          className="hidden"
          type="file"
          ref={file3InputRef}
          onChange={(e) => handleFileChange(3, e)}
        />
        <span className="flex-1 text-title-color">{filePath3}</span>
        <FloatingButton
          className="flex-0 w-36 h-8 bg-transparent border rounded-lg border-normal-color text-[10px]"
          onClick={() => file3InputRef.current.click()}
        >
          ファイルアップロード
        </FloatingButton>
      </div>
      <div className="flex flex-row items-center mb-6">
        <input
          className="hidden"
          type="file"
          ref={file4InputRef}
          onChange={(e) => handleFileChange(4, e)}
        />
        <span className="flex-1 text-title-color">{filePath4}</span>
        <FloatingButton
          className="flex-0 w-36 h-8 bg-transparent border rounded-lg border-normal-color text-[10px]"
          onClick={() => file4InputRef.current.click()}
        >
          ファイルアップロード
        </FloatingButton>
      </div>
      <div className="flex flex-row justify-center items-center mt-6">
        <input
          type="checkbox"
          className="w-6 h-6 mr-3 outline-none"
          onChange={(e) => copyrightInfoChangeHandler("agreement", e)}
          id="checkbox"
          checked={copyrightInfo.agreement}
        />
        <label
          className={`text-base font-normal ${
            copyrightInfo.agreement ? "text-black" : "text-[#717171]"
          }`}
          htmlFor="checkbox"
        >
          提供するコンテンツが著作権に違反していないことに同意します。
        </label>
      </div>
      {/* <button onClick={handleUpload}>Upload</button> */}
    </div>
  );
};

export default CopyrightInformation;
