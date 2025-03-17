import { useTranslations } from "next-intl";
import Image from "next/image";
import Button from "ui/atoms/Button";

interface VerifyAndChangeEmailProps {
  restoredEmail: string;
  lang: string;
}

const VerifyAndChangeEmail: React.FC<VerifyAndChangeEmailProps> = ({ restoredEmail, lang }) => {
  const t = useTranslations("Account");

  return (
    <div className="flex grow w-full py-20 justify-center items-center">
      <div className="w-full lg:w-[1000px] h-[600px]">
        <div className="flex justify-center w-full h-[302px]">
          <Image
            src="/admin/images/complete.svg"
            alt="Tobiratory logo"
            width={264}
            height={226}
            className="mt-[50px]"
          />
        </div>
        <div className="text-base-content text-center text-2xl sm:text-[32px] font-bold mt-[8px]">
          {t("VerifyAndChangeEmail")}
        </div>
        <div className="text-base-content text-center text-md sm:text-lg mt-[24px]">
          {t("VerifyAndChangeEmailNote")}
        </div>
        <div className="text-base-content text-center text-[16px] text-blue-500 text-xs sm:text-md mt-[24px]">
          &#91; <span>{restoredEmail}</span> &#93;
        </div>
        <div className="flex justify-center mt-10">
          <Button
            className="btn btn-block w-[179px] h-[48px] px-[14px] py-[8px] bg-primary rounded-[12px]
              text-base-white text-[16px] md:text-[16px] sm:text-[9px] leading-3 font-normal hover:bg-primary hover:border-primary"
            onClick={() => (window.location.href = `/admin/${lang}/authentication`)}
          >
            {t("ContinueButton")}
          </Button>
        </div>
        <div className="flex justify-center mt-[153px]">
          <div className="self-end font-normal text-[12px] text-base-content pb-6">
            Tobiratory Inc. all rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyAndChangeEmail;
