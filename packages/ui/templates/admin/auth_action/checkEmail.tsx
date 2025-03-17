import { useTranslations } from "next-intl";
import Image from "next/image";

const CheckEmail = ({ email }) => {
  const t = useTranslations("Account");
  return (
    <div className="flex grow w-full justify-center items-center">
      <div className="w-full lg:w-[1000px] h-[600px]">
        <div className="flex justify-center w-full h-[302px]">
          <Image
            src="/admin/images/checkEmail.svg"
            alt="Tobiratory logo"
            width={264}
            height={226}
            className="mt-[50px] text-base-primary"
          />
        </div>
        <div className="text-2xl sm:text-[32px] font-bold mt-[33px]">
          {t("CheckEmail")}
        </div>
        <div className="text-base-content leading-[2] text-center text-md sm:text-lg mt-[24px]">
          {t("CheckEmailNote_1")}
          &nbsp;{" "}
          <span
            className="text-blue-500"
            onClick={() => (window.location.href = "/admin/authentication")}
          >
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
