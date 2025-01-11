import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { ReactNode } from "react";
import { OptionMark, RequireMark } from "ui/atoms/Marks";
import { Locale } from "ui/organisms/admin/LanguageSwitch";

const Row1 = ({
  label,
  description,
  optional,
  children,
}: {
  label: string;
  description?: string;
  optional?: boolean;
  children: ReactNode;
}) => {
  const lang = useLocale();
  return (
    <div className="sm:flex flex-row sm:py-4 sm:pl-6 py-3">
      <div
        className={`h-12 ${
          lang === Locale.JA ? "min-w-[400px]" : "min-w-[480px]"
        }`}
      >
        <div className="flex-none flex flex-row items-center">
          <span className="text-base mr-4">{label ? label : ""}</span>
          {optional ? <OptionMark /> : <RequireMark />}
        </div>
        {description ? (
          <div className="flex gap-1">
            <Image
              src="/admin/images/info-icon-2.svg"
              width={16}
              height={16}
              alt="information"
            />
            <span className="text-[12px]">{description}</span>
          </div>
        ) : null}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

const ContentInformation = ({ contentInfo, setContentInfo, refs }) => {
  const t = useTranslations("TCP");
  const contentInfoChangeHandler = (field, e) => {
    setContentInfo({
      ...contentInfo,
      [field]: e.target.value.substring(0, 255),
    });
  };

  return (
    <>
      <div className="sm:mb-6 mb-3 sm:text-[40px] font-medium text-title-color text-center">
        {t("ContentInfo")}
      </div>
      <Row1 label={t("ContentName")} description={t("ContentNameUsage")}>
        <input
          id="content_name"
          className={clsx(
            "flex-1 w-full h-12 pl-5",
            "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
            "text-sm font-normal text-input-color",
            "placeholder:text-placeholder-color placeholder:font-normal",
          )}
          placeholder={t("ContentName")}
          value={contentInfo.name}
          onChange={(e) => contentInfoChangeHandler("name", e)}
          ref={refs["name"]}
        />
      </Row1>
      <Row1 label={t("ContentDescription")}>
        <textarea
          id="content_description"
          className={clsx(
            "flex-1",
            "w-full sm:h-32 h-[300px] pl-5 pt-4 resize-none",
            "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
            "text-sm font-normal text-input-color",
            "placeholder:text-placeholder-color placeholder:font-normal",
          )}
          placeholder={t("ContentDescription")}
          value={contentInfo.description}
          onChange={(e) => contentInfoChangeHandler("description", e)}
          ref={refs["description"]}
        />
      </Row1>
      <Row1 label={t("HomepageURL")} optional={true}>
        <input
          id="content_url"
          className={clsx(
            "flex-1 w-full h-12 pl-5",
            "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
            "text-sm font-normal text-input-color",
            "placeholder:text-placeholder-color placeholder:font-normal",
          )}
          placeholder={t("URL")}
          value={contentInfo.url}
          onChange={(e) => contentInfoChangeHandler("url", e)}
        />
      </Row1>
    </>
  );
};

export default ContentInformation;
