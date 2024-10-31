import { useTranslations } from "next-intl";
import NextImage from "next/image";
import React from "react";
import Button from "ui/atoms/Button";

type Props = {
  buttonHandler: () => void;
};

const GenerateErrorComponent: React.FC<Props> = (props) => {
  const t = useTranslations("Workspace");
  return (
    <div className="flex flex-col items-center pt-[152px]">
      <NextImage
        src="/admin/images/icon/report-problem.svg"
        width={98}
        height={98}
        alt="warning"
      />
      <span className="text-error text-sm font-semibold mt-5">
        {t("SomethingWrong")}
      </span>
      <Button
        className="w-[140px] h-8 mt-[135px] rounded-lg text-base-white bg-primary text-sm font-medium"
        onClick={props.buttonHandler}
      >
        {t("TryAgain")}
      </Button>
    </div>
  );
};

export default React.memo(GenerateErrorComponent);
