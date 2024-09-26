import clsx from "clsx";
import Image from "next/image";
import { ChangeEvent, MutableRefObject, useRef } from "react";
import Button from "ui/atoms/Button";
import { OptionMark, RequireMark } from "ui/atoms/Marks";
import RadioButtonGroup from "ui/organisms/admin/RadioButtonGroup";

const CopyrightInformation = ({ copyrightInfo, setCopyrightInfo, refs }) => {
  const copyrightInfoChangeHandler = (field, value) => {
    if (field === "copyrightHolder") {
      setCopyrightInfo({
        ...copyrightInfo,
        [field]: value.replace(/^©/, "").substring(0, 255),
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
      <div className="md:mb-16 mb-6 text-center">
        <span className="sm:text-[40px] md:mr-10 font-medium">著作権情報</span>
      </div>
      <div className="flex flex-row items-center sm:justify-start justify-between">
        <span className="text-base sm:mr-[15px]">コピーライト（版権表記）</span>
        <RequireMark />
      </div>
      <div className="md:mb-[50px] mb-6 md:flex flex-row justify-between items-center md:space-y-0 space-y-4 md:mt-0 mt-4">
        <div className="flex flex-row items-center">
          <Image
            src="/admin/images/info-icon-2.svg"
            width={16}
            height={16}
            alt="information"
          />
          <span className="text-[12px] ml-2">
            ここでは１つのみ提出してください。あとから追加・変更が可能です。
          </span>
        </div>
        {/* Be sure to include 'sm:' and 'md:' like
         'sm:focus-within:border-focus-color md:focus-within:border-focus-color'
          to prevent 'hover:' from taking precedence. */}
        <label
          className={clsx(
            "input flex items-center gap-1",
            "w-[370px] h-12 pl-5 ml-7",
            "outline-none border-2 rounded-lg border-input-color hover:border-hover-color",
            "focus:outline-none focus-within:outline-none sm:focus-within:border-focus-color md:focus-within:border-focus-color",
            "text-sm font-normal text-input-color",
          )}
        >
          ©
          <input
            id="copyright_holder"
            className={clsx(
              "w-full text-sm font-normal text-input-color",
              "placeholder:text-placeholder-color placeholder:font-normal",
            )}
            placeholder="Tobiratory"
            value={copyrightInfo.copyrightHolder}
            onChange={(e) =>
              copyrightInfoChangeHandler("copyrightHolder", e.target.value)
            }
            ref={refs["copyrightHolder"]}
          />
        </label>
      </div>
      <div className={"md:flex flex-row justify-between md:mb-[50px] mb-1"}>
        <div className="flex flex-col md:text-nowrap">
          <div className="mb-4 flex flex-row items-center sm:justify-start justify-between">
            <p className="md:w-auto w-[80%] text-base sm:mr-8">
              所有している著作権やライセンス情報の提供
            </p>
            <OptionMark />
          </div>
          <div className="md:mb-12 mb-4 flex flex-row items-center gap-1">
            <Image
              src="/admin/images/info-icon-2.svg"
              width={16}
              height={16}
              alt="information"
            />
            <span className="text-[12px] sm:ml-4">
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
      <div className="md:flex flex-row justify-between">
        <div className="flex flex-col md:text-nowrap">
          <div className="mb-4 flex flex-row items-center sm:justify-start justify-between">
            <p className="md:w-auto w-[80%] text-base sm:mr-8">
              Default License
            </p>
            <OptionMark />
          </div>
          <div className="flex flex-row items-center gap-1">
            <Image
              src="/admin/images/info-icon-2.svg"
              width={16}
              height={16}
              alt="information"
            />
            <span className="text-[12px] sm:ml-4">
              It can be changed later.
            </span>
          </div>
        </div>
      </div>
      <div className="px-6 mt-6">
        <div className="border rounded-lg p-6 border-primary text-primary">
          <p className="text-[14px] font-bold">
            Prohibited Actions under All Licenses
          </p>
          <div className="text-[12px]">
            <p>&bull; Use that violates public order and morals.</p>
            <p>
              &bull; Use that significantly damages the image of our company,
              products, or characters.
            </p>
            <p>
              &bull; Use that harms or could potentially harm the social
              reputation of the author of the work being used.
            </p>
            <p>
              &bull; Use that infringes or could potentially infringe the rights
              of others.
            </p>
            <p>
              &bull; Use that creates or could create the misconception that we
              support or endorse specific individuals, political parties,
              religious organizations, etc.
            </p>
            <p>
              &bull; Copying or reproducing works without adding substantial
              modifications is considered “replication” and is prohibited.
            </p>
          </div>
        </div>
        <div className="mt-8">
          <RadioButtonGroup
            title="Commercial Use (COM/NCM)"
            onChange={(value) => copyrightInfoChangeHandler("COM", value)}
          />
          <hr className="pb-3 border-primary" />
          <RadioButtonGroup
            title="Adaptation (ADP)"
            onChange={(value) => copyrightInfoChangeHandler("ADP", value)}
          />
          <hr className="pb-3 border-primary" />
          <RadioButtonGroup
            title="Derivative Works (DER)"
            onChange={(value) => copyrightInfoChangeHandler("DER", value)}
          />
          <hr className="pb-3 border-primary" />
          <RadioButtonGroup
            title="Distribution for Free (DST)"
            onChange={(value) => copyrightInfoChangeHandler("DST", value)}
          />
          <hr className="pb-3 border-primary" />
          <RadioButtonGroup
            title="Credit Omission (NCR)"
            onChange={(value) => copyrightInfoChangeHandler("NCR", value)}
          />
        </div>
      </div>
      <div className="flex flex-row justify-center items-center mt-6">
        <input
          type="checkbox"
          className="w-6 h-6 sm:mr-3 mr-1 outline-none"
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
    <div className="flex flex-row items-center md:mb-6 mb-4">
      <input
        className="hidden"
        type="file"
        ref={fileRef}
        onChange={(e) => {
          handleChange(index, false, e);
        }}
      />
      <div className="md:flex-1 text-title-color text-left mr-[15px] h-[24px]">
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
              <div
                className="w-[16px] h-[16px] bg-base-content"
                style={{
                  WebkitMaskImage: "url(/admin/images/icon/cross.svg)",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  WebkitMaskSize: "contain",
                }}
              ></div>
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
