import { useTranslations } from "next-intl";
import Image from "next/image";
import { Fragment } from "react";
import { OptionMark, RequireMark } from "ui/atoms/Marks";

const Row1 = ({ label, wide, children }) => {
  return (
    <div className="md:flex flex-row items-center py-4 w-full ">
      <div
        className={`${
          wide
            ? "sm:w-[40%] w-full sm:justify-start justify-between"
            : "sm:w-[40%] w-full sm:justify-start justify-between"
        } flex-none flex flex-row items-center`}
      >
        <span className="text-base mr-4 text-wrap">{label}</span>
        {label.length ? <RequireMark /> : <></>}
      </div>
      <div className={`flex-auto break-all md:pl-10${wide ? "" : ""}`}>
        {children}
      </div>
    </div>
  );
};

const Row3 = ({ label, children }) => {
  return (
    <div className="md:flex flex-row items-center py-4 w-full">
      <div className="sm:w-[40%] w-full flex-none flex flex-row items-center sm:justify-start justify-between">
        <span className="text-base mr-4 md:text-wrap text-nowrap">{label}</span>
        {label.length ? <OptionMark /> : <></>}
      </div>
      <div className="flex-auto break-all md:pl-10">{children}</div>
    </div>
  );
};

const Row4 = ({ label, children }) => {
  return (
    <div className="md:flex flex-row py-4">
      <div className="sm:w-[40%] w-full  h-12 flex-none flex flex-row items-center sm:justify-start justify-between">
        <span className="text-base mr-4 md:text-wrap sm:text-nowrap text-wrap">
          {label}
        </span>
        {label.length ? <OptionMark /> : <></>}
      </div>
      <div className="flex items-center md:pl-10">{children}</div>
    </div>
  );
};

// When making this app multilingual, replace this process.
const countryNames = {
  japan: "日本",
};

const ConfirmInformation = ({
  contentInfo,
  userInfo,
  copyrightInfo,
}) => {
  const copyrightFiles = () => {
    return [
      copyrightInfo.file1?.name,
      copyrightInfo.file2?.name,
      copyrightInfo.file3?.name,
      copyrightInfo.file4?.name,
    ]
      .filter((f) => f !== undefined)
      .map((line, index) => (
        <span key={index} className="pr-2">
          {line},
        </span>
      ));
  };

  const replaceNewLinesWithBreaks = (text) => {
    return text.split("\n").map((line, index) => (
      <Fragment key={index}>
        {line}
        <br />
      </Fragment>
    ));
  };

  const getDefaultLicense = (license) =>
    Object.entries(license)
      .filter(([, value]) => value === true)
      .map(([key]) => <Fragment key={key}>{key}, </Fragment>);

  const t = useTranslations("TCP");
  const d = useTranslations("DateFormat");
  return (
    <div>
      <div className="mb-6 text-title-color flex flex-col items-center">
        <span className="sm:text-[40px] font-medium">
          {t("RegistrantInfo")}
        </span>
        <div className="flex flex-row gap-2 items-center">
          <Image
            src="/admin/images/info-icon-2.svg"
            width={16}
            height={16}
            alt="information"
            className=""
          />
          <span className="text-[12px]/[48x] ml-[7px]">
            {t("EnterApplicantInfo")}
          </span>
        </div>
      </div>
      <Row1 label={t("ContentName")} wide={false}>
        <span className="">{contentInfo.name}</span>
      </Row1>
      <Row1 label={t("Description")} wide={false}>
        <span className="">
          {replaceNewLinesWithBreaks(contentInfo.description)}
        </span>
      </Row1>
      <Row3 label={t("HomepageURL")}>
        <span className="">{contentInfo.url}</span>
      </Row3>
      <Row1 label={t("ApplicantName")} wide={false}>
        <span className="">
          {userInfo.lastName} {userInfo.firstName}
        </span>
      </Row1>
      <Row1 label={t("DateOfBirth")} wide={false}>
        <span className="">
          {d("Date", {
            date: new Date(
              userInfo.birthdayYear,
              userInfo.birthdayMonth,
              userInfo.birthdayDate,
            ),
          })}
        </span>
      </Row1>
      <Row1 label={t("MailAddress")} wide={false}>
        <span className="">{userInfo.email}</span>
      </Row1>
      <Row1 label={t("PhoneNumber")} wide={false}>
        <span className="">{userInfo.phone}</span>
      </Row1>
      <Row1 label={t("Address")} wide={false}>
        <span className="">
          {userInfo.building} {userInfo.street} {userInfo.city}{" "}
          {userInfo.province} {userInfo.postalCode}{" "}
          {countryNames[userInfo.country]}
        </span>
      </Row1>
      <Row1 label={t("CopyrightStatement")} wide={false}>
        <span className="">©{copyrightInfo.copyrightHolder}</span>
      </Row1>
      <Row3 label={t("CopyrightLicenseInfo")}>
        <div>{copyrightFiles()}</div>
      </Row3>
      <Row4 label={t("LicenseForWork")}>
        <span className="uppercase">
          {getDefaultLicense(copyrightInfo.license)}
        </span>
      </Row4>
      <Row1 label={t("NoCopyrightInfringe")} wide={true}>
        <span className="">{t("Agree")}</span>
      </Row1>
    </div>
  );
};

export default ConfirmInformation;
