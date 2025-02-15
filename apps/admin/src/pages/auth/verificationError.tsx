import { getMessages } from "admin/messages/messages";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}

const VerificationError = () => {
  const t = useTranslations("FirebaseAuthError");

  return (
    <div className="flex grow w-full h-screen py-[210px] lg:py-[30px] md:py-[10px] sm:py-[5px] justify-center items-center">
      <div className="w-[1000px] h-[600px] mt-[200px]">
        <div className="text-base-content text-center text-[32px]  md:text-[28px] sm:text-[24px] font-bold mt-[8px]">
          {t("VerificationErrorTitle")}
        </div>
        <div className="text-base-content text-center text-[16px]  md:text-[14px] sm:text-[12px] mt-[24px]">
          {t("VerificationError")}
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

export default VerificationError;
