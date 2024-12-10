import {
  getMailAddressOfPasswordAccount,
  hasPasswordAccount,
  VERIFIED_EMAIL_PATH,
} from "contexts/AdminAuthProvider";
import usePasswordReauthentication from "hooks/usePasswordReauthentication";
import useUpdateEmail from "hooks/useUpdateEmail";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/router";
import { MutableRefObject, useEffect, useState } from "react";
import { useToggle } from "react-use";
import { EMAIL_REGEX } from "types/adminTypes";
import Button from "ui/atoms/Button";
import ColorizedSvg from "ui/atoms/ColorizedSvg";
import FirebaseAuthError from "ui/atoms/FirebaseAuthError";
import GhostButton from "ui/atoms/GhostButton";
import Loading from "ui/atoms/Loading";
import SnsReauthModal from "ui/templates/admin/SnsReauthModal";

const AuthStates = {
  Reauth: 0,
  NewEmail: 1,
} as const;
type AuthStates = (typeof AuthStates)[keyof typeof AuthStates];

const EmailEditDialog = ({
  dialogRef,
}: {
  dialogRef: MutableRefObject<HTMLDialogElement>;
}) => {
  const [authState, setAuthState] = useState<AuthStates>(AuthStates.Reauth);
  const router = useRouter();

  const handleComplete = () => {
    dialogRef.current.close();
    setAuthState(AuthStates.Reauth);
    router.push("/auth/confirmation_email_for_account_page");
  };

  const getModalWidth = () => {
    switch (authState) {
      case AuthStates.Reauth:
        return `w-[329px] max-w-[329px]`;
      case AuthStates.NewEmail:
        return `w-[875px] max-w-[875px]`;
    }
  };

  return (
    <dialog ref={dialogRef} className="modal">
      <div
        className={`modal-box ${getModalWidth()} rounded-[16px] pt-4 flex flex-col items-start relative`}
      >
        <form method="dialog">
          <GhostButton
            className=" absolute w-4 h-4 min-h-4 top-4 right-4 over:bg-none hover:bg-opacity-0 border-0 p-0"
            onClick={() => setAuthState(AuthStates.Reauth)}
          >
            <Image
              src="/admin/images/icon/close2.svg"
              width={16}
              height={16}
              alt="close icon"
            />
          </GhostButton>
        </form>
        <Auth
          authState={authState}
          onClickCancel={() => {
            setAuthState(AuthStates.Reauth);
            dialogRef.current.close();
          }}
          onClickNextFromReauth={() => setAuthState(AuthStates.NewEmail)}
          onComplete={handleComplete}
        />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setAuthState(AuthStates.Reauth)}>close</button>
      </form>
    </dialog>
  );
};

const Auth = ({
  authState,
  onClickCancel,
  onClickNextFromReauth,
  onComplete,
}: {
  authState: AuthStates;
  onClickCancel: () => void;
  onClickNextFromReauth: () => void;
  onComplete: () => void;
}) => {
  switch (authState) {
    case AuthStates.Reauth:
      if (hasPasswordAccount()) {
        return (
          <Reauth
            onClickCancel={onClickCancel}
            onClickNext={onClickNextFromReauth}
          />
        );
      }
      return (
        <SnsReauthModal
          onCancel={onClickCancel}
          onComplete={onClickNextFromReauth}
        />
      );
    case AuthStates.NewEmail:
      return <NewEmail onClickCancel={onClickCancel} onComplete={onComplete} />;
  }
};

const Reauth = ({
  onClickCancel,
  onClickNext,
}: {
  onClickCancel: () => void;
  onClickNext: () => void;
}) => {
  const [password, setPassword] = useState<string | null>(null);
  const [passwordVisible, togglePasswordVisible] = useToggle(false);
  const [reauthenticate, reauthenticating, userCredential, error] =
    usePasswordReauthentication();
  const t = useTranslations("AccountPassword");
  const l = useTranslations("Account");
  const lang = useLocale();

  useEffect(() => {
    if (!userCredential) {
      return;
    }
    onClickNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCredential]);

  const getPasswordIconUrl = () => {
    return passwordVisible
      ? "/admin/images/icon/visibility-on-icon.svg"
      : "/admin/images/icon/visibility-off-icon.svg";
  };
  return (
    <>
      <div className="flex flex-col items-start gap-[6px] self-stretch">
        <div className="flex justify-center items-center">
          <span className="text-base-black text-[24px] pt-[10px] pb-[14px] font-bold leading-[120%]">
            {t("PasswordConfirmation")}
          </span>
        </div>
      </div>
      <div className="flex mt-[36px] pt-0 pb-0 flex-col items-start gap-[16px] self-stretch">
        <div className="flex flex-col items-start gap-[6px] self-stretch">
          <span className="text-base-black text-[14px] font-medium leading-[20px]">
            {t("Name")}
          </span>
          <div className="flex h-[36px] items-center gap-[8px] self-stretch">
            <div className="flex flex-col items-start gap-[6px] flex-grow shrink-0 basis-0">
              <div className="rounded-[64px] ">
                <input
                  type={"text"}
                  value={getMailAddressOfPasswordAccount()}
                  disabled={true}
                  className="w-[281px] h-[36px] rounded-[64px] bg-disabled-field base-200-content font-normal pl-[12px] placeholder:text-center input-bordered text-[14px] font-normal leading-[20px]"
                />
              </div>
            </div>
          </div>
        </div>
        <div className={"flex flex-col items-start gap-[6px] self-stretch"}>
          <span className="text-base-black text-[14px] font-medium leading-[20px]">
            {t("Password")}
          </span>
          <label className="input input-bordered flex justify-between items-center gap-2 rounded-[64px] base-content text-base-black font-medium w-[281px] h-[36px] pl-[12px] placeholder:text-base-content placeholder:text-left">
            <input
              type={passwordVisible ? "text" : "password"}
              value={password}
              placeholder={"Password"}
              className="w-full bg-base-100 bg-autofill:bg-yellow-200"
              onChange={(e) => setPassword(e.target.value)}
            />
            <GhostButton
              className="w-[16px] h-[16px] min-h-[16px] p-0 justify-end"
              onClick={togglePasswordVisible}
            >
              <ColorizedSvg
                url={getPasswordIconUrl()}
                className="w-[16px] h-[16px] bg-secondary object-cover"
              />
            </GhostButton>
          </label>
        </div>
      </div>
      <div className="h-[24px]">
        <FirebaseAuthError error={error} />
      </div>
      <div className="modal-action flex h-[64px] mt-[5px] pt-0 pr-0 pl-[24px] pb-0 justify-end items-end gap-[16px] self-stretch">
        <Button
          type="button"
          className={`btn btn-block h-[33px] min-h-[33px] px-[16px] py-[8px] bg-base-100 rounded-[64px] border-[1px] border-primary
              text-primary text-[14px] leading-[120%] font-medium hover:bg-base-100 hover:border-primary ${
                lang === "en" ? "w-[78px]" : "w-[120px]"
              }`}
          onClick={onClickCancel}
        >
          {l("Cancel")}
        </Button>
        {reauthenticating ? (
          <div className="flex justify-center items-center w-[95px] h-[33px] min-h-[33px]">
            <Loading className="w-6 h-6" />
          </div>
        ) : (
          <Button
            type="button"
            className="btn btn-block w-[95px] h-[33px] min-h-[33px] px-[16px] py-[8px] bg-primary rounded-[64px]
              text-base-white text-[14px] leading-[120%] font-bold hover:bg-primary hover:border-primary"
            onClick={() => reauthenticate(password)}
          >
            {t("Continue")}
          </Button>
        )}
      </div>
    </>
  );
};

const NewEmail = ({
  onClickCancel,
  onComplete,
}: {
  onClickCancel: () => void;
  onComplete: () => void;
}) => {
  const [email, setEmail] = useState<string | null>(null);
  const [validEmail, setValidEmail] = useState(false);
  const [updateEmail, updating, isSuccessful, error] = useUpdateEmail();
  const t = useTranslations("Account");
  const lang = useLocale();

  useEffect(() => {
    if (!isSuccessful) {
      return;
    }

    onComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessful]);

  useEffect(() => {
    if (EMAIL_REGEX.test(email)) {
      setValidEmail(true);
    }
  }, [email]);

  return (
    <>
      <div className="flex flex-col items-center gap-[16px] self-stretch mt-[10px]">
        <div className="flex flex-col items-start gap-[6px] self-stretch">
          <div className="flex items-center gap-[16px] self-stretch">
            <div className="flex flex-col items-start gap-[6px] flex-grow shrink-0 basis-0">
              <div className="flex items-center gap-[6px] self-stretch mt-[10px]">
                <div className="w-[150px] text-right">
                  <span className="text-base-black text-right text-[14px] font-semibold leading-none">
                    {t("NewEmailAddress")}
                  </span>
                </div>
                <div className="flex items-center py-[8px] pl-0 pr-[48px] flex-grow shrink-0 basis-0">
                  <input
                    type="text"
                    value={email}
                    placeholder={"Email"}
                    className="w-[670px] h-[33px] input input-bordered border-neutral-200 rounded-[64px] base-content font-normal mt-[0px] placeholder:text-base-content placeholder:text-left"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[24px] ml-[130px]">
        {error && (
          <div className="flex items-center gap-[8px]">
            <ColorizedSvg
              url="/admin/images/icon/warning-bold.svg"
              className={"w-[24px] h-[24px] bg-attention"}
            />
            <FirebaseAuthError error={error} />
          </div>
        )}
      </div>
      <div className="modal-action flex justify-end items-center gap-[16px] self-stretch mt-0">
        <Button
          type="button"
          className={`btn btn-block h-[33px] min-h-[33px] px-[16px] py-[8px] bg-base-100 rounded-[64px] border-[2px] border-primary
              text-primary text-[14px] leading-[120%] font-semibold hover:bg-base-100 hover:border-primary ${
                lang === "en" ? "w-[78px]" : "w-[120px]"
              }`}
          onClick={onClickCancel}
        >
          {t("Cancel")}
        </Button>
        {updating ? (
          <div className="flex justify-center items-center w-[95px] h-[33px] min-h-[33px]">
            <Loading className="w-6 h-6" />
          </div>
        ) : (
          <Button
            type="button"
            disabled={!validEmail}
            className="btn btn-block w-[125px] h-[33px] min-h-[33px] px-[14px] py-[8px] bg-primary rounded-[64px]
              text-base-white text-[14px] leading-[120%] font-semibold hover:bg-primary hover:border-primary"
            onClick={() => updateEmail(email, VERIFIED_EMAIL_PATH)}
          >
            {t("SaveChanges")}
          </Button>
        )}
      </div>
    </>
  );
};

export default EmailEditDialog;
