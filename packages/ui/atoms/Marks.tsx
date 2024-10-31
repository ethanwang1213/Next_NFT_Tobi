import { useTranslations } from "next-intl";

export function RequireMark() {
  const t = useTranslations("TCP");
  return (
    <span className="px-[10px] py-[2px] rounded bg-[#EA1010] text-[10px] leading-[21px] text-center text-white text-nowrap font-semibold">
      {t("Required")}
    </span>
  );
}

export function OptionMark() {
  const t = useTranslations("TCP");
  return (
    <span className="px-[10px] py-[2px] rounded bg-secondary text-[10px] leading-[21px] text-center text-white text-nowrap font-semibold">
      {t("Optional")}
    </span>
  );
}
