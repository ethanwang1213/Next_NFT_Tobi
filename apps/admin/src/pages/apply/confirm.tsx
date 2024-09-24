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
        <span className="text-base mr-4 md:text-wrap sm:text-nowrap text-wrap">
          {label}
        </span>
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
  originalContentDeclaration,
  setOriginalContentDeclaration,
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

  const getDefaultLicense = (license) => {
    return Object.entries(license)
      .map(([key, value]) => {
        if (value === "OK") {
          return <Fragment key={key}>{key}, </Fragment>; 
        }
        return null; 
      })
      .filter(Boolean);
  };

  return (
    <div>
      <div className="mb-6 text-title-color flex flex-col items-center">
        <span className="sm:text-[40px] font-medium">登録者情報</span>
        <div className="flex flex-row gap-2 items-center">
          <Image
            src="/admin/images/info-icon-2.svg"
            width={16}
            height={16}
            alt="information"
            className=""
          />
          <span className="text-[12px]/[48x] ml-4">
            申請されている方の情報をご記入ください
          </span>
        </div>
      </div>
      <Row1 label="コンテンツ名" wide={false}>
        <span className="">{contentInfo.name}</span>
      </Row1>
      <Row1 label="コンテンツの説明" wide={false}>
        <span className="">
          {replaceNewLinesWithBreaks(contentInfo.description)}
        </span>
      </Row1>
      <Row3 label="ホームページURL">
        <span className="">{contentInfo.url}</span>
      </Row3>
      <Row1 label="申請者氏名" wide={false}>
        <span className="">
          {userInfo.lastName} {userInfo.firstName}
        </span>
      </Row1>
      <Row1 label="生年月日" wide={false}>
        <span className="">
          {userInfo.birthdayYear}年 {userInfo.birthdayMonth}月{" "}
          {userInfo.birthdayDate}日
        </span>
      </Row1>
      <Row1 label="メールアドレス" wide={false}>
        <span className="">{userInfo.email}</span>
      </Row1>
      <Row1 label="電話番号" wide={false}>
        <span className="">{userInfo.phone}</span>
      </Row1>
      <Row1 label="住所" wide={false}>
        <span className="">
          {userInfo.building} {userInfo.street} {userInfo.city}{" "}
          {userInfo.province} {userInfo.postalCode}{" "}
          {countryNames[userInfo.country]}
        </span>
      </Row1>
      <Row1 label="コピーライト（版権表記）" wide={false}>
        <span className="">©{copyrightInfo.copyrightHolder}</span>
      </Row1>
      <Row3 label="著作物に関するライセンス">
        <div>{copyrightFiles()}</div>
      </Row3>
      <Row4 label="所有している著作権やライセンス情報の提供">
        <span className="">
          {getDefaultLicense(copyrightInfo)}
          {/* {replaceNewLinesWithBreaks(copyrightInfo.license)} */}
        </span>
      </Row4>
      <Row1
        label="提供するコンテンツが著作権に違反していないことに同意します。"
        wide={true}
      >
        <span className="">同意する</span>
      </Row1>
      <div className="flex flex-row justify-center items-center mt-6">
        <input
          id={"originalContentDeclaration"}
          type={"checkbox"}
          checked={originalContentDeclaration}
          className="w-6 h-6 sm:mr-3 mr-1 outline-none"
          onChange={(e) => setOriginalContentDeclaration(e.target.checked)}
        />
        <label
          className={`font-medium text-[16px] ${
            originalContentDeclaration ? "text-black" : "text-base-content"
          }`}
          htmlFor={"originalContentDeclaration"}
        >
          オリジナルコンテンツ制作の宣言
        </label>
      </div>
    </div>
  );
};

export default ConfirmInformation;
