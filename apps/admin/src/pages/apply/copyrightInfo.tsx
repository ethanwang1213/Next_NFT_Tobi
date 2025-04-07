import clsx from "clsx";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ChangeEvent, MutableRefObject, useRef } from "react";
import Button from "ui/atoms/Button";
import { OptionMark, RequireMark } from "ui/atoms/Marks";
import RadioButtonGroup from "ui/organisms/admin/RadioButtonGroup";

const CopyrightInformation = ({ copyrightInfo, setCopyrightInfo, refs }) => {
  const t = useTranslations("TCP");
  const l = useTranslations("License");

  const copyrightInfoChangeHandler = (field, value) => {
    if (field === "copyrightHolder" && value.length<=100) {
      setCopyrightInfo({
        ...copyrightInfo,
        [field]: value.replace(/^©/, "").substring(0, 255),
      });
    } else if (["com", "adp", "der", "mer", "dst", "ncr"].includes(field)) {
      setCopyrightInfo({
        ...copyrightInfo,
        license: {
          ...copyrightInfo.license,
          [field]: value,
        },
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

  const actions = [
    l("Actions.0"),
    l("Actions.1"),
    l("Actions.2"),
    l("Actions.3"),
    l("Actions.4"),
    l("Actions.5"),
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
        <span className="sm:text-[40px] md:mr-10 font-medium">
          {t("CopyrightsLicenses")}
        </span>
      </div>
      <div className="flex flex-row items-center sm:justify-start justify-between">
        <span className="text-base sm:mr-[15px]">
          {t("CopyrightStatement")}
        </span>
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
          <span className="text-[12px] ml-2">{t("SubmitSingleDocument")}</span>
        </div>
        <label
          className={clsx(
            "input flex items-center gap-1",
            "sm:w-[370px] h-12 pl-5 ml-7",
            "outline-none border-2 rounded-lg border-input-color hover:border-hover-color",
            "focus:outline-none focus-within:outline-none sm:focus-within:border-focus-color md:focus-within:border-focus-color",
            "text-sm font-normal text-input-color",
          )}
        >
          ©
          <div className="relative w-full">
          <input
            id="copyright_holder"
            className={clsx(
              "w-full text-sm font-normal text-input-color pr-20",
              "placeholder:text-placeholder-color placeholder:font-normal via-primary-200",
            )}
            placeholder="Tobiratory"
            value={copyrightInfo.copyrightHolder}
            onChange={(e) =>
              copyrightInfoChangeHandler("copyrightHolder", e.target.value)
            }
            ref={refs["copyrightHolder"]}
          />
           <span className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none text-[13px] hidden md:inline-block">
            <span className={"text-[#FF811C]"}>{copyrightInfo.copyrightHolder.length}</span> | 100
          </span>
          </div>
        </label>
      </div>
      <div className={"md:flex flex-row justify-between md:mb-[50px] mb-1"}>
        <div className="flex flex-col">
          <div className="mb-4 flex flex-row items-center sm:justify-start justify-between">
            <p className="md:w-auto text-base sm:mr-8">
              {t("CopyrightLicenseInfo")}
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
              {t("SubmitOfficialDocs")}
              <br />
              {t("FileSupportInfo")}
            </span>
          </div>
        </div>
        <div className={"flex flex-col max-w-[400px] pl-[10px]"}>
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
            <p className="md:w-auto text-base sm:mr-8">{t("DefaultLicense")}</p>
            <OptionMark />
          </div>
          <div className="flex flex-row items-center gap-1">
            <Image
              src="/admin/images/info-icon-2.svg"
              width={16}
              height={16}
              alt="information"
            />
            <span className="text-[12px] sm:ml-4">{t("ChangeLater")}</span>
          </div>
        </div>
      </div>
      <div className="px-6 mt-6">
        <div className="border rounded-lg p-6 border-primary text-primary">
          <p className="text-[14px] font-bold">{l("ProhibitedActions")}</p>
          <div className="text-[12px]">
            {actions.map((action, index) => (
              <p key={index}>&bull; {action}</p>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <RadioButtonGroup
            initialValue={copyrightInfo.license.com}
            title={l("CommercialUse")}
            onChange={(value) => copyrightInfoChangeHandler("com", value)}
          />
          <hr className="pb-3 border-primary" />
          <RadioButtonGroup
            title={l("Adaptation")}
            initialValue={copyrightInfo.license.adp}
            onChange={(value) => copyrightInfoChangeHandler("adp", value)}
          />
          <hr className="pb-3 border-primary" />
          <RadioButtonGroup
            title={l("Derivative")}
            initialValue={copyrightInfo.license.der}
            onChange={(value) => copyrightInfoChangeHandler("der", value)}
          />
          <hr className="pb-3 border-primary" />
          <RadioButtonGroup
            title={l("Merchandising")}
            initialValue={copyrightInfo.license.mer}
            onChange={(value) => copyrightInfoChangeHandler("mer", value)}
          />
          <hr className="pb-3 border-primary" />
          <RadioButtonGroup
            title={l("Distribution")}
            initialValue={copyrightInfo.license.dst}
            onChange={(value) => copyrightInfoChangeHandler("dst", value)}
          />
          <hr className="pb-3 border-primary" />
          <RadioButtonGroup
            title={l("CreditOmission")}
            initialValue={copyrightInfo.license.ncr}
            onChange={(value) => copyrightInfoChangeHandler("ncr", value)}
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
          {t("NoCopyrightInfringe")}
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
  const t = useTranslations("TCP");
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
    <div className="flex flex-row justify-between items-center md:mb-6 mb-4">
      <input
        className="hidden"
        type="file"
        ref={fileRef}
        onChange={(e) => {
          handleChange(index, false, e);
        }}
      />
      <div className="md:flex-1 flex text-title-color text-left mr-[15px] h-[24px]">
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
        {t("FileUpload")}
      </Button>
    </div>
  );
};

export default CopyrightInformation;
