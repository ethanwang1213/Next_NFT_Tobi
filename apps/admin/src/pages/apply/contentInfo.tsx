import clsx from "clsx";
import { ReactNode } from "react";
import { OptionMark, RequireMark } from "ui/atoms/Marks";

const Row1 = ({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: ReactNode;
}) => {
  return (
    <div className="flex flex-row py-4 pl-6">
      <div className="w-52 h-12 flex-none flex flex-row items-center">
        <span className="text-base mr-4">{label ? label : ""}</span>
        {optional ? <OptionMark /> : <RequireMark />}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

const ContentInformation = ({ contentInfo, setContentInfo, refs }) => {
  const contentInfoChangeHandler = (field, e) => {
    if (field === "description") {
      setContentInfo({
        ...contentInfo,
        [field]: e.target.value.substring(0, 255),
      });
    } else {
      setContentInfo({ ...contentInfo, [field]: e.target.value });
    }
  };

  return (
    <>
      <div className="mb-6 text-2xl/[48x] text-title-color">コンテンツ情報</div>
      <Row1 label="コンテンツ名">
        <input
          id="content_name"
          className={clsx(
            "flex-1 w-full h-12 pl-5",
            "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
            "text-sm font-normal text-input-color",
            "placeholder:text-placeholder-color placeholder:font-normal",
          )}
          placeholder="コンテンツ名"
          value={contentInfo.name}
          onChange={(e) => contentInfoChangeHandler("name", e)}
          ref={refs["name"]}
        />
      </Row1>
      <Row1 label="サイトURL" optional={true}>
        <input
          id="content_url"
          className={clsx(
            "flex-1 w-full h-12 pl-5",
            "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
            "text-sm font-normal text-input-color",
            "placeholder:text-placeholder-color placeholder:font-normal",
          )}
          placeholder="ホームページ"
          value={contentInfo.url}
          onChange={(e) => contentInfoChangeHandler("url", e)}
        />
      </Row1>
      <Row1 label="コンテンツ概要">
        <textarea
          id="content_description"
          className={clsx(
            "flex-1",
            "w-full h-32 pl-5 pt-4 resize-none",
            "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
            "text-sm font-normal text-input-color",
            "placeholder:text-placeholder-color placeholder:font-normal",
          )}
          placeholder="コンテンツ概要"
          value={contentInfo.description}
          onChange={(e) => contentInfoChangeHandler("description", e)}
          ref={refs["description"]}
        />
      </Row1>
    </>
  );
};

export default ContentInformation;
