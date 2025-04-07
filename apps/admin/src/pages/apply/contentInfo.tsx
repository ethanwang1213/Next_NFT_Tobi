import clsx from "clsx";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ReactNode } from "react";
import { OptionMark, RequireMark } from "ui/atoms/Marks";

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
  return (
    <div className="flex flex-col md:flex-row gap-4 sm:py-4 sm:p1-6 py-3">
      <div className="w-full md:w-1/3">
        <div className="flex-none flex flex-row items-center justify-between">
          <span className="text-base mr-4">{label ? label : ""}</span>
          {optional ? <OptionMark /> : <RequireMark />}
        </div>
        {description && (
          <div className="flex gap-1 items-start">
            <span className="shrink-0 text-[12px] leading-[1.3]">
              <Image
                src="/admin/images/info-icon-2.svg"
                width={16}
                height={16}
                alt="information"
                className="inline-block"
              />
            </span>
            <span className="text-[12px]">{description}</span>
          </div>
        )}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};

const ContentInformation = ({ contentInfo, setContentInfo, refs }) => {
  const t = useTranslations("TCP");
  const contentInfoChangeHandler = (field, e) => {
    const limits = { name: 30, description: 150, url: 100 };
    if (limits[field] && e.target.value.length <= limits[field]) {
      setContentInfo({
        ...contentInfo,
        [field]: e.target.value,
      });
    }
  };

  return (
    <>
      <div className="sm:mb-6 mb-3 sm:text-[40px] font-medium text-title-color text-center">
        {t("ContentInfo")}
      </div>
      <Row1 label={t("ContentName")} description={t("ContentNameUsage")}>
        <div className="relative">
          <input
            id="content_name"
            className={clsx(
              "flex-1 w-full h-12 pl-5 p-6",
              "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
              "text-sm font-normal text-input-color",
              "placeholder:text-placeholder-color placeholder:font-normal",
            )}
            placeholder={t("ContentName")}
            value={contentInfo.name}
            onChange={(e) => contentInfoChangeHandler("name", e)}
            ref={refs["name"]}
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none text-[13px] hidden md:inline-block">
            <span className={"text-[#FF811C]"}>{contentInfo.name.length}</span> | 30
          </span>
        </div>
      </Row1>
      <Row1
        label={t("ContentDescription")}
        description={t("ContentDescriptionUsage")}
      >
        <div className="relative">
          <textarea
            id="content_description"
            className={clsx(
              "flex-1",
              "w-full sm:h-32 h-[300px] pl-5 pr-6 pt-4 resize-none",
              "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
              "text-sm font-normal text-input-color",
              "placeholder:text-placeholder-color placeholder:font-normal",
            )}
            placeholder={t("ContentDescription")}
            value={contentInfo.description}
            onChange={(e) => contentInfoChangeHandler("description", e)}
            ref={refs["description"]}
          />
          <span className="absolute right-6 top-5 -translate-y-1/2 pointer-events-none select-none text-[13px]">
            <span className={"text-[#FF811C]"}>{contentInfo.description.length}</span> | 150
          </span>
        </div>
      </Row1>
      <Row1 label={t("HomepageURL")} optional={true}>
        <div className="relative">
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
          <span className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none text-[13px] hidden md:inline-block">
            <span className={"text-[#FF811C]"}>{contentInfo.url.length}</span> | 100
          </span>
        </div>
      </Row1>
    </>
  );
};

export default ContentInformation;
