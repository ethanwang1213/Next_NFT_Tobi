import { getMessages } from "admin/messages/messages";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Button from "ui/atoms/Button";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}

const VerifiedEmail = () => {
  const t = useTranslations("Account");
  return (
    <div className="flex grow w-full py-[210px] lg:py-[30px] md:py-[10px] sm:py-[5px] justify-center items-center">
      <div className="w-[1000px] h-[600px]">
        <div className="flex justify-center w-full h-[302px]">
          <Image
            src="/admin/images/mail.svg"
            alt="Tobiratory logo"
            width={264}
            height={226}
            className="mt-[50px] invert text-base-primary"
          />
        </div>
        <div className="text-base-content text-center text-[32px]  md:text-[28px] sm:text-[24px] font-bold mt-[8px]">
          {t("VerifiedEmailTitle")}
        </div>
        <div className="text-base-content text-center text-[16px]  md:text-[14px] sm:text-[12px] mt-[24px]">
          {t("VerifiedEmailNote")}
        </div>
        <div className="flex justify-center mt-[40px] lg:mt-[20px] md:mt-[10px] sm:mt-[5px]">
          <Button
            className="btn btn-block w-[179px] h-[48px] px-[14px] py-[8px] bg-primary rounded-[12px]
              text-base-white text-[16px] md:text-[16px] sm:text-[9px] leading-3 font-normal hover:bg-primary hover:border-primary"
            onClick={() => (window.location.href = "/admin/auth/email_auth")}
          >
            {t("continueBtn")}
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

export default VerifiedEmail;
