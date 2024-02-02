import { useState } from "react";
import { OptionMark, RequireMark } from "ui/atoms/Marks";
import StyledTextArea from "ui/molecules/StyledTextArea";
import StyledTextInput from "ui/molecules/StyledTextInput";

const Row1 = ({ label, children }) => {
  return (
    <div className="flex flex-row py-4 pl-6">
      <div className="w-52 h-12 flex-none flex flex-row items-center">
        <span className="text-base mr-4">{label}</span>
        {label.length ? <RequireMark /> : <></>}
      </div>
      <div className="flex-auto">{children}</div>
    </div>
  );
};

const Row2 = ({ label1, label2, children }) => {
  return (
    <div className="flex flex-row py-4 pl-6">
      <div className="w-52 h-12 flex-none flex flex-row items-center">
        <span className="text-base mr-4">
          {label1}
          {label2.length ? (
            <>
              <br />
              {label2}
            </>
          ) : null}
        </span>
        {label1 ? <RequireMark /> : <></>}
      </div>
      <div className="flex-auto">{children}</div>
    </div>
  );
};

const Row3 = ({ label, children }) => {
  return (
    <div className="flex flex-row py-4 pl-6">
      <div className="w-52 h-12 flex-none flex flex-row items-center">
        <span className="text-base mr-4">{label}</span>
        {label.length ? <OptionMark /> : <></>}
      </div>
      <div className="flex-auto">{children}</div>
    </div>
  );
};

const ContentInformation = () => {
  const [contentInfo, setContentInfo] = useState(null);

  const fieldChangeHandler = (field, value) => {
    setContentInfo({ ...{ ...contentInfo, [field]: value } });
  };

  return (
    <>
      <div className="mb-6 text-2xl/[48x] text-title-color">コンテンツ情報</div>
      <Row1 label="コンテンツ名">
        <StyledTextInput
          className="flex-1"
          label="コンテンツ名"
          placeholder="コンテンツ名"
          value={""}
          changeHandler={(value) => fieldChangeHandler("name", value)}
        />
      </Row1>
      <Row2 label1="コンテンツ名" label2="フリガナ">
        <StyledTextInput
          className="flex-1"
          label="フリガナ"
          placeholder="フリガナ"
          value={""}
          changeHandler={(value) => fieldChangeHandler("ruby", value)}
        />
      </Row2>
      <Row3 label="ホームページURL">
        <StyledTextInput
          className="flex-1"
          label="ホームページ"
          placeholder="ホームページ"
          value={""}
          changeHandler={(value) => fieldChangeHandler("url", value)}
        />
      </Row3>
      <div className="mt-12 mb-6 text-2xl/[48x] text-title-color">
        コンテンツの概要
      </div>
      <Row1 label="ジャンル">
        <StyledTextInput
          className="w-64"
          label="ジャンル"
          placeholder="ジャンル"
          value={""}
          changeHandler={(value) => fieldChangeHandler("genre", value)}
        />
      </Row1>
      <Row1 label="コンテンツの説明">
        <StyledTextArea
          className="flex-1"
          label="コンテンツの説明"
          placeholder="コンテンツの説明"
          value={""}
          changeHandler={(value) => fieldChangeHandler("description", value)}
        />
      </Row1>
    </>
  );
};

export default ContentInformation;
