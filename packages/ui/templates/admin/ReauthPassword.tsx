import { PASSWORD_RESET_PATH } from "admin/src/pages/authentication";
import { getMailAddressOfPasswordAccount } from "contexts/AdminAuthProvider";
import { auth } from "fetchers/firebase/client";
import { sendSignInLinkToEmail } from "firebase/auth";
import usePasswordReauthentication from "hooks/usePasswordReauthentication";
import { useEffect, useState } from "react";
import { ErrorMessage } from "types/adminTypes";
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

  const handleClickPasswordReset = async () => {
    const actionCodeSettings = {
      url: `${window.location.origin}/${PASSWORD_RESET_PATH}`,
      handleCodeInApp: true,
    };
    sendSignInLinkToEmail(
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

  useEffect(() => {
    if (!userCredential) {
      return;
    }

    onClickNext();
  }, [userCredential]);

  return (
    <ReauthTemplate position={Position.Top} onClickBack={onClickBack}>
      <div className="flex w-[780px] h-[80px] flex-col justify-center shrink-0 mt-[50px]">
        <span className="text-secondary text-center text-[32px] font-bold leading-[normal]">
          Password
        </span>
      </div>
      <div className="w-[408px] h-[52px] shrink-0 mt-[103px]">
        <input
          type={"text"}
          value={getMailAddressOfPasswordAccount()}
          disabled={true}
          className="rounded-[16px] bg-disabled-field base-200-content text-[16px] font-normal w-[408px] h-[52px] mt-[10px] pl-[16px] placeholder:text-center input-bordered shadow-[inset_0_4px_4px_0_rgba(0,0,0,0.25)]"
        />
      </div>
      <div className="w-[408px] h-[52px] mt-[48px]">
        <input
          type={"password"}
          value={password}
          placeholder={"Password"}
          className="rounded-[16px] bg-base-100 text-[16px] text-secondary font-normal w-[408px] h-[52px] mt-[10px] pl-[15px] placeholder:text-base-content placeholder:text-left input-bordered shadow-[inset_0_4px_8px_0_rgb(0,0,0,0.5)]"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex flex-col justify-center w-[418px] h-[24px] mt-[8px]">
        <button
          type={"button"}
          className={
            "btn-link text-primary text-right text-[12px] font-semibold"
          }
          onClick={onClickPasswordReset}
        >
          I forgot my password!
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
            Next
          </Button>
        )}
      </div>
    </ReauthTemplate>
  );
};

export default ReauthPassword;
