import clsx from "clsx";
import { OptionMark, RequireMark } from "ui/atoms/Marks";

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
  const contentInfoChangeHandler = (field, e) => {
    setContentInfo({ ...contentInfo, [field]: e.target.value });
  };

  const handleRubyChange = (field, event) => {
    const rubyCharacters =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポァィゥェォッャュョヮヵヶ"; // The set of allowed characters
    // Create a regular expression pattern that matches any character not in the allowed set
    const pattern = new RegExp(`[^${rubyCharacters}]`, "g");
    // Use the replace method to remove characters not in the allowed set
    const inputRuby = event.target.value.replace(pattern, "");
    // Apply any additional masking or validation logic as needed
    setContentInfo({ ...contentInfo, [field]: inputRuby });
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
      <Row2 label1="コンテンツ名" label2="フリガナ">
        <input
          id="content_ruby"
          className={clsx(
            "flex-1 w-full h-12 pl-5",
            "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
            "text-sm font-normal text-input-color",
            "placeholder:text-placeholder-color placeholder:font-normal",
          )}
          placeholder="フリガナ"
          value={contentInfo.ruby}
          onChange={(e) => handleRubyChange("ruby", e)}
          ref={refs["ruby"]}
        />
      </Row2>
      <Row3 label="ホームページURL">
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
      </Row3>
      <div className="mt-12 mb-6 text-2xl/[48x] text-title-color">
        コンテンツの概要
      </div>
      <Row1 label="ジャンル">
        <input
          id="content_genre"
          className={clsx(
            "w-64 h-12 pl-5",
            "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
            "text-sm font-normal text-input-color",
            "placeholder:text-placeholder-color placeholder:font-normal",
          )}
          placeholder="ジャンル"
          value={contentInfo.genre}
          onChange={(e) => contentInfoChangeHandler("genre", e)}
          ref={refs["genre"]}
        />
      </Row1>
      <Row1 label="コンテンツの説明">
        <textarea
          id="content_description"
          className={clsx(
            "flex-1",
            "w-full h-32 pl-5 pt-4 resize-none",
            "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
            "text-sm font-normal text-input-color",
            "placeholder:text-placeholder-color placeholder:font-normal",
          )}
          placeholder="コンテンツの説明"
          value={contentInfo.description}
          onChange={(e) => contentInfoChangeHandler("description", e)}
          ref={refs["description"]}
        />
      </Row1>
    </>
  );
};

export default ContentInformation;
