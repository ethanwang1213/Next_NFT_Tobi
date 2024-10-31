import { useTranslations } from "next-intl";
import NextImage from "next/image";
import React from "react";
import Button from "ui/atoms/Button";

const ButtonGroupComponent = (props: {
  backButtonHandler: () => void;
  nextButtonHandler: () => void;
  skipButtonHandler?: () => void;
  disabled: boolean;
  isGenerate?: boolean;
}) => {
  const t = useTranslations("Workspace");
  return (
    <div className="flex justify-between">
      <Button
        className="w-[80px] h-8 rounded-lg border border-primary flex items-center justify-between pl-1 pr-4"
        onClick={props.backButtonHandler}
      >
        <NextImage
          width={20}
          height={20}
          src="/admin/images/icon/arrow-left-s-line.svg"
          alt="left arrow"
        />
        <span className="text-primary text-sm font-medium">{t("Back")}</span>
      </Button>
      {props.skipButtonHandler && (
        <Button
          className="w-[80px] h-8 rounded-lg border border-primary flex items-center justify-between pl-4 pr-2"
          onClick={props.skipButtonHandler}
        >
          <span className="text-primary text-sm font-medium">{t("Skip")}</span>
          <NextImage
            width={20}
            height={20}
            src="/admin/images/icon/skip.svg"
            alt="skip"
            className="mt-[2px]"
          />
        </Button>
      )}
      {!props.isGenerate && (
        <Button
          className={`w-[80px] h-8 rounded-lg flex items-center justify-between pl-4 pr-[6px]
          ${props.disabled ? "bg-secondary" : "bg-primary"}`}
          onClick={props.nextButtonHandler}
          disabled={props.disabled}
        >
          <span className="text-base-white text-sm font-medium">
            {t("Next")}
          </span>
          <NextImage
            width={20}
            height={20}
            src="/admin/images/icon/arrow-right-s-line.svg"
            alt="left arrow"
          />
        </Button>
      )}
      {props.isGenerate && (
        <Button
          className={`w-[86px] h-8 rounded-lg flex items-center justify-center
          ${props.disabled ? "bg-secondary" : "bg-warning"}`}
          onClick={props.nextButtonHandler}
          disabled={props.disabled}
        >
          <span className="text-base-white text-sm font-medium">
            {t("Generate")}
          </span>
        </Button>
      )}
    </div>
  );
};

export default React.memo(ButtonGroupComponent);
