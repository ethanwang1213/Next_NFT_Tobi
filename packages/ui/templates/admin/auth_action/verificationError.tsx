import { useTranslations } from "next-intl";

const VerificationError = () => {
  const t = useTranslations("FirebaseAuthError");

  return (
    <div className="flex grow w-full h-screen py-20 justify-center items-center">
      <div className="w-full sm:max-w-[1000px] h-[600px] mt-[200px] p-3">
        <div className="text-base-content text-center text-2xl sm:text-[32px] font-bold mt-[8px]">
          {t("VerificationErrorTitle")}
        </div>
        <div className="text-base-content text-center text-md sm:text-lg mt-[24px]">
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
