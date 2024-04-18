import clsx from "clsx";
import Image from "next/image";
import { ChangeEvent, MutableRefObject, useRef } from "react";
import Button from "ui/atoms/Button";
import { OptionMark, RequireMark } from "ui/atoms/Marks";

const CopyrightInformation = ({ copyrightInfo, setCopyrightInfo, refs }) => {
  const copyrightInfoChangeHandler = (field, value) => {
    if (["copyrightHolder", "license"].includes(field)) {
      setCopyrightInfo({
        ...copyrightInfo,
        [field]: value.substring(0, 255),
      });
    } else {
      setCopyrightInfo({ ...copyrightInfo, [field]: value });
    }
  };

  const fileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const fileNames = [
    copyrightInfo.file1?.name,
    copyrightInfo.file2?.name,
    copyrightInfo.file3?.name,
    copyrightInfo.file4?.name,
  ];

  const handleFileChange = (
    field: number,
    clear: boolean,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = clear ? null : e.target.files[0];
    switch (field) {
      case 1:
        copyrightInfoChangeHandler("file1", selectedFile);
        break;
      case 2:
        copyrightInfoChangeHandler("file2", selectedFile);
        break;
      case 3:
        copyrightInfoChangeHandler("file3", selectedFile);
        break;
      case 4:
        copyrightInfoChangeHandler("file4", selectedFile);
        break;

      default:
        break;
    }
  };

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
          value={copyrightInfo.copyrightHolder}
          onChange={(e) =>
            copyrightInfoChangeHandler("copyrightHolder", e.target.value)
          }
          ref={refs["copyrightHolder"]}
        />
      </div>
      <div className={"flex flex-row justify-between mb-[50px]"}>
        <div className="flex flex-col text-nowrap">
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
              <br />
              20MB以内のJPEG、PNG、PDFファイルのみ対応しています。
            </span>
          </div>
        </div>
        <div className={"flex flex-col w-full pl-[10px]"}>
          <FileUploadButtons
            names={fileNames}
            refs={fileInputRefs}
            handleChange={handleFileChange}
          />
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
            "w-[508px] h-[137px] pl-5 pt-4 resize-none",
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
    </div>
  );
};

type FileHandleChange = (
  id: number,
  clear: boolean,
  e: ChangeEvent<HTMLInputElement>,
) => void;

const FileUploadButtons = ({
  names,
  refs,
  handleChange,
}: {
  names: (string | undefined)[];
  refs: MutableRefObject<HTMLInputElement>[];
  handleChange: FileHandleChange;
}) => {
  return (
    <div>
      {names.map((name, index) => (
        <FileUploadButton
          key={`file-upload-button-${index}`}
          index={index + 1}
          name={name}
          fileRef={refs[index]}
          handleChange={handleChange}
        />
      ))}
    </div>
  );
};

const FileUploadButton = ({
  index,
  name,
  fileRef,
  handleChange,
}: {
  index: number;
  name?: string;
  fileRef: MutableRefObject<HTMLInputElement>;
  handleChange: FileHandleChange;
}) => {
  const truncateString = (str?: string) => {
    const num = 20;
    if (str?.length > num) {
      const prefix = str.substring(0, 10);
      const suffix = str.substring(str.length - 10);
      return prefix + "..." + suffix;
    } else {
      return str;
    }
  };

  return (
    <div className="flex flex-row items-center mb-6">
      <input
        className="hidden"
        type="file"
        ref={fileRef}
        onChange={(e) => {
          handleChange(index, false, e);
        }}
      />
      <div className="flex-1 text-title-color text-left mr-[15px] h-[24px]">
        {name && (
          <>
            <span className={"align-baseline"}>{truncateString(name)}</span>
            <button
              className="align-middle ml-[15px]"
              onClick={() => {
                fileRef.current.value = "";
                handleChange(index, true, null);
              }}
            >
              <Image
                src={`/admin/images/icon/cross.svg`}
                alt={"clear file"}
                width={16}
                height={16}
              />
            </button>
          </>
        )}
      </div>
      <Button
        className="flex-0 w-36 h-8 bg-transparent border rounded-lg border-normal-color text-[10px]"
        onClick={() => fileRef.current.click()}
      >
        ファイルアップロード
      </Button>
    </div>
  );
};

export default CopyrightInformation;
