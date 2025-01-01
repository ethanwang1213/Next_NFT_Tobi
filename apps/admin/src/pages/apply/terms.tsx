import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useState } from "react";
import Button from "ui/atoms/Button";
import { getMessages } from "admin/messages/messages";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}

const Terms = () => {
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();
  const t = useTranslations("TCP");

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleButtonClicked = () => {
    router.replace("/apply/register");
  };
  return (
    <div className="md:container h-full px-6 flex flex-col items-center mx-auto sm:py-20 py-8 text-center font-normal text-base text-[#717171]">
      <div className="md:text-[40px] sm:text-[30px] text-[20px] leading-[60px]">
        Tobiratory Creator Program
      </div>
      <div className="md:text-[40px] text-[20px] md:leading-[60px] font-medium text-secondary-400">
        {t("TermsOfService")}
      </div>
      <textarea
        className="w-full h-[24rem] p-2 mt-6 outline-none shadow-[inset_4px_4px_4px_rgba(0,0,0,0.25)]"
        readOnly
        value={`Terms of Use
        Welcome to Tobiratory Creator Program!
        If you have any questions or concerns about these Terms of Use, please contact us at [Contact Email].
        Thank you for using Tobiratory Creator Program!
        `}
      />
      <div className="flex flex-row items-center mt-6">
        <input
          type="checkbox"
          className="w-6 h-6 sm:mr-3 mr-1 outline-none"
          onChange={handleCheckboxChange}
          id="checkbox"
        />
        <label
          className={`text-base font-normal sm:text-[16px] text-[12px] ${
            isChecked ? "text-black" : "text-[#717171]"
          }`}
          htmlFor="checkbox"
        >
          {t("AgreeTermsPrivacy")}
        </label>
      </div>
      <Button
        type="button"
        className={`w-[16rem] h-[3.5rem] rounded-[30px] mt-16 sm:text-xl text-[16px] leading-[3.5rem] text-white
          ${isChecked ? "bg-[#1779DE] " : "bg-[#B3B3B3]"}`}
        disabled={!isChecked}
        onClick={handleButtonClicked}
      >
        {t("SubmitApplication")}
      </Button>
    </div>
  );
};

export default Terms;
