import clsx from "clsx";
import Image from "next/image";
import { useRef } from "react";
import Button from "ui/atoms/Button";
import { OptionMark, RequireMark } from "ui/atoms/Marks";

const CopyrightInformation = ({ copyrightInfo, setCopyrightInfo, refs }) => {
  const copyrightInfoChangeHandler = (field, value) => {
    if (field === "copyrightHolders") {
      value = value.split(",").map((item) => item.trim());
    }
    setCopyrightInfo({ ...copyrightInfo, [field]: value });
  };

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
        //setFilePath1(selectedFile.name);
        copyrightInfoChangeHandler("file1", selectedFile.name);
        break;
      case 2:
        // setFile2(selectedFile);
        copyrightInfoChangeHandler("file2", selectedFile.name);
        break;
      case 3:
        // setFile3(selectedFile);
        copyrightInfoChangeHandler("file3", selectedFile.name);
        break;
      case 4:
        // setFile4(selectedFile);
        copyrightInfoChangeHandler("file4", selectedFile.name);
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
      <div className="flex flex-row items-center">
        <span className="text-base mr-[15px]">コピーライト（版権表記）</span>
        <RequireMark />
      </div>
      <div className="mb-[50px] flex flex-row justify-between items-center">
        <div className="flex flex-row items-center">
          <Image
            src="/admin/images/info-icon-2.svg"
            width={16}
            height={16}
            alt="information"
          />
          <span className="text-[12px] ml-4">
            ここでは１つのみ提出してください。あとから追加・変更が可能です。
          </span>
        </div>
        <input
          id="copyright_holder"
          className={clsx(
            "w-[178px] h-8 pl-5",
            "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
            "text-sm font-normal text-input-color",
            "placeholder:text-placeholder-color placeholder:font-normal",
          )}
          placeholder="©Tobiratory"
          value={copyrightInfo.copyrightHolders.join(", ")}
          onChange={(e) =>
            copyrightInfoChangeHandler("copyrightHolders", e.target.value)
          }
          ref={refs["copyrightHolders"]}
        />
      </div>
      <div className={"flex flex-row justify-between mb-[50px]"}>
        <div className="flex flex-col">
          <div className="mb-4 flex flex-row items-center">
            <span className="text-base mr-8">
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
            />
            <span className="text-[12px] ml-4">
              著作権やライセンスを証明する公式文書を提出できます。
            </span>
          </div>
        </div>
        <div className={"flex flex-col pl-[10px]"}>
          {/* TODO: ファイルアップロードのボタンはコンポーネント化する */}
          <div className="flex flex-row items-center mb-6">
            <input
              className="hidden"
              type="file"
              ref={file1InputRef}
              onChange={(e) => handleFileChange(1, e)}
            />
            <span className="flex-1 text-title-color">
              {copyrightInfo.file1}
            </span>
            <Button
              className="flex-0 w-36 h-8 bg-transparent border rounded-lg border-normal-color text-[10px]"
              onClick={() => file1InputRef.current.click()}
            >
              ファイルアップロード
            </Button>
          </div>
          <div className="flex flex-row items-center mb-6">
            <input
              className="hidden"
              type="file"
              ref={file2InputRef}
              onChange={(e) => handleFileChange(2, e)}
            />
            <span className="flex-1 text-title-color">
              {copyrightInfo.file2}
            </span>
            <Button
              className="flex-0 w-36 h-8 bg-transparent border rounded-lg border-normal-color text-[10px]"
              onClick={() => file2InputRef.current.click()}
            >
              ファイルアップロード
            </Button>
          </div>
          <div className="flex flex-row items-center mb-6">
            <input
              className="hidden"
              type="file"
              ref={file3InputRef}
              onChange={(e) => handleFileChange(3, e)}
            />
            <span className="flex-1 text-title-color">
              {copyrightInfo.file3}
            </span>
            <Button
              className="flex-0 w-36 h-8 bg-transparent border rounded-lg border-normal-color text-[10px]"
              onClick={() => file3InputRef.current.click()}
            >
              ファイルアップロード
            </Button>
          </div>
          <div className="flex flex-row items-center mb-6">
            <input
              className="hidden"
              type="file"
              ref={file4InputRef}
              onChange={(e) => handleFileChange(4, e)}
            />
            <span className="flex-1 text-title-color">
              {copyrightInfo.file4}
            </span>
            <Button
              className="flex-0 w-36 h-8 bg-transparent border rounded-lg border-normal-color text-[10px]"
              onClick={() => file4InputRef.current.click()}
            >
              ファイルアップロード
            </Button>
          </div>
        </div>
      </div>
      <div className="mb-[50px] flex flex-row justify-between">
        <div className={"flex flex-col"}>
          <div className="flex flex-row mb-4 items-center">
            <span className="text-base mr-[15px]">
              著作物に関するライセンス
            </span>
            <OptionMark />
          </div>
          <div className="flex flex-row items-center">
            <Image
              src="/admin/images/info-icon-2.svg"
              width={16}
              height={16}
              alt="information"
            />
            <span className="text-[12px] ml-4">あとから変更可能です。</span>
          </div>
        </div>
        <textarea
          id="copyright_license"
          className={clsx(
            "w-[548px] h-[137px] pl-5 pt-4 resize-none",
            "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
            "text-sm font-normal text-input-color",
            "placeholder:text-placeholder-color placeholder:font-normal",
          )}
          placeholder="CC0"
          value={copyrightInfo.license}
          onChange={(e) =>
            copyrightInfoChangeHandler("license", e.target.value)
          }
          ref={refs["license"]}
        />
      </div>
      <div className="flex flex-row justify-center items-center mt-6">
        <input
          type="checkbox"
          className="w-6 h-6 mr-3 outline-none"
          onChange={(e) =>
            copyrightInfoChangeHandler("agreement", e.target.checked)
          }
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
