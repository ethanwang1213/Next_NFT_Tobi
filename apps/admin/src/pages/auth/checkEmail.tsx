import { getMessages } from "admin/messages/messages";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import Image from "next/image";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}

const CheckEmail = ({ onsubmit, email }) => {
  const t = useTranslations("Account");
  return (
    <div className="flex grow w-full py-[210px] lg:py-[30px] md:py-[10px] sm:py-[5px] justify-center items-center">
      <div className="w-[1000px] h-[600px]">
        <div className="flex justify-center w-full h-[302px]">
          <Image
            src="/admin/images/checkEmail.svg"
            alt="Tobiratory logo"
            width={264}
            height={226}
            className="mt-[50px] text-base-primary"
          />
        </div>
        <div className="text-base-content text-center text-[32px] md:text-[28px] sm:text-[24px] font-bold mt-[33px]">
          {t("CheckEmail")}
        </div>
        <div className="text-base-content leading-[2] text-center text-[18px] md:text-[16px] sm:text-[14px] mt-[24px]">
          {t("CheckEmailNote_1")}
          &nbsp;{" "}
          <span className="text-blue-500">
            &#91; <span>{email}</span> &#93;
          </span>
          &nbsp;
          {t("CheckEmailNote_2")} <br />
          {t("CheckEmailNote_3")}
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

export default CheckEmail;
