import Image from "next/image";
import { Fragment } from "react";
import { OptionMark, RequireMark } from "ui/atoms/Marks";

const Row1 = ({ label, wide, children }) => {
  return (
    <div className="flex flex-row items-center py-4">
      <div
        className={`${
          wide ? "w-[550px]" : "w-64"
        } flex-none flex flex-row items-center`}
      >
        <span className="text-base mr-4 text-nowrap">{label}</span>
        {label.length ? <RequireMark /> : <></>}
      </div>
      <div className={`flex-auto break-all ${wide ? "text-end" : ""}`}>
        {children}
      </div>
    </div>
  );
};

const Row3 = ({ label, children }) => {
  return (
    <div className="flex flex-row items-center py-4">
      <div className="w-64 flex-none flex flex-row items-center">
        <span className="text-base mr-4 text-nowrap">{label}</span>
        {label.length ? <OptionMark /> : <></>}
      </div>
      <div className="flex-auto break-all">{children}</div>
    </div>
  );
};

const Row4 = ({ label, children }) => {
  return (
    <div className="flex flex-col py-4">
      <div className="w-64 h-12 flex-none flex flex-row items-center">
        <span className="text-base mr-4 text-nowrap">{label}</span>
        {label.length ? <OptionMark /> : <></>}
      </div>
      <div className="flex-auto">
        <div className={"flex justify-end"}>{children}</div>
      </div>
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
        <Fragment key={index}>
          {line}
          <br />
        </Fragment>
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

  return (
    <div>
      <div className="mb-6 text-title-color flex flex-row items-center">
        <span className="text-2xl/[48x] mr-10">登録者情報</span>
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
        <span className="">{copyrightInfo.copyrightHolder}</span>
      </Row1>
      <Row3 label="著作物に関するライセンス">
        <span className="">{copyrightFiles()}</span>
      </Row3>
      <Row4 label="所有している著作権やライセンス情報の提供">
        <span className="">
          {replaceNewLinesWithBreaks(copyrightInfo.license)}
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
          className="w-6 h-6 mr-3 outline-none"
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
