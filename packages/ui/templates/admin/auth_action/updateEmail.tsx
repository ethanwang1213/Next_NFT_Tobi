import { auth } from "fetchers/firebase/client";
import { sendPasswordResetEmail } from "firebase/auth";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { ErrorMessage } from "types/adminTypes";
import { Locale } from "types/localeTypes";
import FirebaseAuthError from "ui/atoms/FirebaseAuthError";
import Loading from "ui/atoms/Loading";
import CheckEmail from "./checkEmail";

const UpdateEmail = ({
  email,
  locale,
}: {
  email: string;
  oobCode: string;
  locale: Locale;
}) => {
  const t = useTranslations("Account");
  const [check, setCheck] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [authError, setAuthError] = useState<ErrorMessage | null>(null);

  const sendEmailForPasswordReset = async () => {
    auth.languageCode = locale;
    setAuthError(null);
    setSendingEmail(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setCheck(true);
    } catch (error) {
      console.error(error);
      setAuthError({ code: error.code, message: error.message });
    }
    setSendingEmail(false);
  };

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
            className={`text-base-primary ${
              sendingEmail ? "" : "cursor-pointer"
            } text-[18px] text-blue-500`}
            onClick={() => {
              if (!sendingEmail) sendEmailForPasswordReset();
            }}
          >
            {t("UpdateEmailNote_5")}
          </span>
          {sendingEmail ? (
            <Loading className="text-info align-text-bottom" />
          ) : (
            <div className="inline-block w-[24px]">&nbsp;</div>
          )}
        </div>
        <div className="h-[30px] text-center">
          <FirebaseAuthError error={authError} />
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
