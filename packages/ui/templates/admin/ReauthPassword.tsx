import {
  getMailAddressOfPasswordAccount,
  PASSWORD_RESET_PATH,
} from "contexts/AdminAuthProvider";
import { auth } from "fetchers/firebase/client";
import { sendPasswordResetEmail } from "firebase/auth";
import usePasswordReauthentication from "hooks/usePasswordReauthentication";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ErrorMessage } from "types/adminTypes";
import { getNormalLocale, getPathWithLocale } from "types/localeTypes";
import Button from "ui/atoms/Button";
import FirebaseAuthError from "ui/atoms/FirebaseAuthError";
import Loading from "ui/atoms/Loading";
import ReauthTemplate from "ui/templates/admin/ReauthTemplate";
import ConfirmationSent from "./ConfirmationSent";
import { Position } from "./ReauthTemplate";

const Page = {
  Main: 0,
  EmailSent: 1,
} as const;
type Page = (typeof Page)[keyof typeof Page];

const ReauthPassword = ({
  error,
  onClickBack,
  onClickNext,
}: {
  error?: ErrorMessage;
  onClickBack: () => void;
  onClickNext: () => void;
}) => {
  const [page, setPage] = useState<Page>(Page.Main);
  const locale = useLocale();

  const handleClickPasswordReset = async () => {
    const path = getPathWithLocale(locale, PASSWORD_RESET_PATH);
    const actionCodeSettings = {
      url: `${window.location.origin}/${path}`,
      handleCodeInApp: true,
    };
    auth.languageCode = getNormalLocale(locale);
    sendPasswordResetEmail(
      auth,
      getMailAddressOfPasswordAccount(),
      actionCodeSettings,
    );
    setPage(Page.EmailSent);
  };

  if (page == Page.EmailSent) {
    return <ConfirmationSent onClickBack={() => setPage(Page.Main)} />;
  }

  return (
    <Reauth
      error={error}
      onClickPasswordReset={handleClickPasswordReset}
      onClickBack={onClickBack}
      onClickNext={onClickNext}
    />
  );
};

const Reauth = ({ error, onClickPasswordReset, onClickBack, onClickNext }) => {
  const [password, setPassword] = useState<string | null>("");
  const [reauthenticate, reauthenticating, userCredential, reauthError] =
    usePasswordReauthentication();
  const t = useTranslations("LogInSignUp");

  useEffect(() => {
    if (!userCredential) {
      return;
    }

    onClickNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCredential]);

  return (
    <ReauthTemplate position={Position.Top} onClickBack={onClickBack}>
      <div className="flex w-full md:w-[780px] h-[80px] flex-col justify-center shrink-0 mt-[50px]">
        <span className="text-secondary text-center text-2xl sm:text-[32px] font-bold leading-[normal]">
          {t("AccountVerification")}
        </span>
        <br />
      </div>
      <div className="w-full sm:w-[408px] h-[52px] shrink-0 mt-[103px]">
        <input
          type={"text"}
          value={getMailAddressOfPasswordAccount()}
          disabled={true}
          className="rounded-[16px] bg-disabled-field base-200-content text-[16px] font-normal w-full sm:w-[408px] h-[52px] mt-[10px] px-[16px] placeholder:text-center input-bordered shadow-[inset_0_4px_4px_0_rgba(0,0,0,0.25)]"
        />
      </div>
      <div className="w-full sm:w-[408px] h-[52px] mt-[48px]">
        <input
          type={"password"}
          value={password}
          placeholder={t("PromptPassword")}
          className="rounded-[16px] bg-base-100 text-[16px] text-secondary font-normal w-full sm:w-[408px] h-[52px] mt-[10px] px-[15px] placeholder:text-base-content placeholder:text-left input-bordered shadow-[inset_0_4px_8px_0_rgb(0,0,0,0.5)]"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex flex-col justify-center w-full sm:w-[418px] h-[24px] mt-[8px]">
        <button
          type={"button"}
          className={
            "btn-link text-primary text-right text-[12px] font-semibold"
          }
          onClick={onClickPasswordReset}
        >
          {t("ForgotPassword")}
        </button>
      </div>
      <div className="h-[52px]">
        <FirebaseAuthError error={error || reauthError} />
      </div>
      <div className="flex justify-center gap-4 mt-[20px] w-[179px] h-[48px] shrink-0">
        {reauthenticating ? (
          <Loading className="w-6 h-6" />
        ) : (
          <Button
            className="btn btn-block px-4 py-2 bg-primary rounded-[16px]
              text-base-white text-[20px] leading-4 font-normal hover:bg-primary hover:border-primary"
            onClick={() => reauthenticate(password)}
          >
            {t("Next")}
          </Button>
        )}
      </div>
    </ReauthTemplate>
  );
};

export default ReauthPassword;
