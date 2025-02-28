import { auth } from "fetchers/firebase/client";
import { confirmPasswordReset } from "firebase/auth";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { ErrorMessage } from "types/adminTypes";
import FlowAgreementWithEmailAndPassword, {
  PageType,
} from "ui/templates/admin/FlowAgreementWithEmailAndPassword";

const PasswordReset = ({
  email,
  oobCode,
  lang,
}: {
  email: string;
  oobCode: string;
  lang: string;
}) => {
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [updatedPassword, setUpdatedPassword] = useState(false);
  const [authError, setAuthError] = useState<ErrorMessage>(null);
  const t = useTranslations("LogInSignUp");
  const l = useTranslations("Label");

  const resetPassword = async (password) => {
    if (!oobCode || !password) return;
    setUpdatingPassword(true);
    setAuthError(null);

    try {
      await confirmPasswordReset(auth, oobCode, password);
      setUpdatedPassword(true);
      await auth.signOut();
    } catch (error) {
      console.error("Error resetting password:", error);
      setAuthError({ code: error.code, message: error.message });
      setUpdatingPassword(false);
    }
  };

  if (updatedPassword) {
    return (
      <div className="flex flex-col items-center justify-center w-[100dvw] p-8">
        <Image
          src={"/admin/images/tobiratory-logo.svg"}
          alt={"Tobiratory logo"}
          width={110}
          height={114}
          className={"mt-[200px]"}
        />
        <div className={"mt-[40px]"}>{t("PasswordResetNotify")}</div>
        <div>
          <button
            type={"button"}
            className={
              "btn-link font-medium text-[14px] text-primary mt-[20px]"
            }
            onClick={() =>
              (window.location.href = `/admin/${lang}/authentication`)
            }
          >
            {t("GoToAuthScreen")}
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flow-row sm:justify-center min-h-screen min-w-[425px]">
        <div className="grow flex flex-col self-stretch">
          <FlowAgreementWithEmailAndPassword
            title={t("PasswordReset")}
            buttonText={l("Reset")}
            email={email}
            isSubmitting={updatingPassword}
            pageType={PageType.PasswordReset}
            authError={authError}
            onClickSubmit={resetPassword}
          />
          <div className="flex grow justify-center mt-20">
            <div className="self-end font-normal text-[12px] text-base-content pb-6">
              Tobiratory Inc. all rights reserved.
            </div>
          </div>
        </div>
        <div className="flex flex-row max-sm:hidden grow overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/admin/images/admin-logo.svg"
            alt="Tobiratory Logo"
            className="object-cover"
          />
        </div>
      </div>
    );
  }
};

export default PasswordReset;
