import { getMessages } from "admin/messages/messages";
import { getAuth } from "firebase/auth";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo, useState } from "react";
import CheckEmail from "./checkEmail";
export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}

const UpdateEmail = () => {
  const t = useTranslations("Account");
  const auth = getAuth();
  const [check, setCheck] = useState(false);
  const email = useMemo(
    () => auth?.currentUser?.email,
    [auth?.currentUser?.email],
  );

  return check ? (
    <CheckEmail email={email} />
  ) : (
    <div className="flex grow w-full py-[210px] lg:py-[30px] md:py-[10px] sm:py-[5px] justify-center items-center">
      <div className="w-[1000px] h-[600px]">
        <div className="flex justify-center w-full h-[302px]">
          <Image
            src="/admin/images/updateEmail.svg"
            alt="Tobiratory"
            width={264}
            height={226}
            className="mt-[50px] text-base-primary"
          />
        </div>
        <div className="text-base-content text-center text-[32px] md:text-[28px] sm:text-[24px] font-bold mt-[33px]">
          {t("UpdateEmail")}
        </div>
        <div className="text-base-content leading-[2] text-center text-[18px] md:text-[16px] sm:text-[14px] mt-[24px]">
          {t("UpdateEmailNote_1")} &nbsp;
          <span className="text-blue-500">
            &#91; <span>{email}</span> &#93;
          </span>
          &nbsp;
          {t("UpdateEmailNote_2")} <br />
          {t("UpdateEmailNote_3")} <br />
          {t("UpdateEmailNote_4")} &nbsp;
          <span
            className="text-base-primary cursor-pointer text-[18px] text-blue-500"
            onClick={() => setCheck(true)}
          >
            {t("UpdateEmailNote_5")}
          </span>
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

export default UpdateEmail;
