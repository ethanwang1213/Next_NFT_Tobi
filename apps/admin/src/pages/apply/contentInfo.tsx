import { OptionMark, RequireMark } from "ui/atoms/Marks";
import StyledTextArea from "ui/molecules/StyledTextArea";
import StyledTextInput from "ui/molecules/StyledTextInput";

const Row1 = ({ label, children }) => {
  return (
    <div className="flex flex-row py-4 pl-6">
      <div className="w-52 h-12 flex-none flex flex-row items-center">
        <span className="text-base mr-4">{label ? label : ""}</span>
        {label && label.length ? <RequireMark /> : <></>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

const Row2 = ({ label1, label2, children }) => {
  return (
    <div className="flex flex-row py-4 pl-6">
      <div className="w-52 h-12 flex-none flex flex-row items-center">
        <span className="text-base mr-4">
          {label1 ? label1 : ""}
          {label2 && label2.length ? (
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
        <span className="text-base mr-4">{label ? label : ""}</span>
        {label && label.length ? <OptionMark /> : <></>}
      </div>
      <div className="flex-auto">{children}</div>
    </div>
  );
};

const ContentInformation = ({ contentInfo, setContentInfo, refs }) => {
  const contentInfoChangeHandler = (field, value) => {
    setContentInfo({ ...contentInfo, [field]: value });
  };

  return (
    <>
      <div className="mb-6 text-2xl/[48x] text-title-color">コンテンツ情報</div>
      <Row1 label="コンテンツ名">
        <StyledTextInput
          className="flex-1"
          label="コンテンツ名"
          placeholder="コンテンツ名"
          value={contentInfo.name}
          changeHandler={(value) => contentInfoChangeHandler("name", value)}
          inputRef={refs["name"]}
        />
      </Row1>
      <Row2 label1="コンテンツ名" label2="フリガナ">
        <StyledTextInput
          className="flex-1"
          label="フリガナ"
          placeholder="フリガナ"
          value={contentInfo.ruby}
          changeHandler={(value) => contentInfoChangeHandler("ruby", value)}
          inputRef={refs["ruby"]}
        />
      </Row2>
      <Row3 label="ホームページURL">
        <StyledTextInput
          className="flex-1"
          label="ホームページ"
          placeholder="ホームページ"
          value={contentInfo.url}
          changeHandler={(value) => contentInfoChangeHandler("url", value)}
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
          value={contentInfo.genre}
          changeHandler={(value) => contentInfoChangeHandler("genre", value)}
          inputRef={refs["genre"]}
        />
      </Row1>
      <Row1 label="コンテンツの説明">
        <StyledTextArea
          className="flex-1"
          label="コンテンツの説明"
          placeholder="コンテンツの説明"
          value={contentInfo.description}
          changeHandler={(value) =>
            contentInfoChangeHandler("description", value)
          }
          inputRef={refs["description"]}
        />
      </Row1>
    </>
  );
};

export default ContentInformation;
