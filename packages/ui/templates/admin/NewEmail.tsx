import { auth } from "fetchers/firebase/client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { EMAIL_REGEX, ErrorMessage, isErrorMessage } from "types/adminTypes";
import Button from "ui/atoms/Button";
import FirebaseAuthError from "ui/atoms/FirebaseAuthError";
import Loading from "ui/atoms/Loading";
import ReauthTemplate from "ui/templates/admin/ReauthTemplate";
import { Position } from "./ReauthTemplate";

type Props = {
  isProcessing: boolean;
  authError?: ErrorMessage;
  onClickBack: () => void;
  onClickNext: (email: string) => void;
};

const NewEmail = ({
  isProcessing,
  authError,
  onClickBack,
  onClickNext,
}: Props) => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations();

  const handleChangeEmail = (email: string) => {
    setEmail(email);
    if (!email.match(EMAIL_REGEX)) {
      setError(t("LogInSignUp.EnterValidEmail"));
    } else {
      setError(null);
    }
  };

  return (
    <ReauthTemplate position={Position.Top} onClickBack={onClickBack}>
      <div className="flex w-[780px] h-[80px] flex-col justify-center shrink-0 mt-[50px]">
        <span className="text-secondary text-center text-[32px] font-bold leading-[normal]">
          {t("AccountNewEmail.Title")}
        </span>
        <br />
      </div>
      <div className="w-[408px] h-[32px] shrink-0 mt-[71px]">
        <span className="text-secondary text-[16px] font-medium">
          {t("Label.EmailAddress")}
        </span>
      </div>
      <div className="w-[408px] h-[52px] shrink-0">
        <input
          type="text"
          value={auth.currentUser.email}
          disabled={true}
          className="rounded-[16px] bg-disabled-field base-200-content text-[16px] font-normal w-[408px] h-[52px] pl-[16px] placeholder:text-center input-bordered shadow-[inset_0_4px_4px_0_rgba(0,0,0,0.25)]"
        />
      </div>
      <div className="w-[408px] h-[32px] shrink-0 mt-[48px]">
        <span className="text-secondary text-[16px] font-medium">
          {t("Account.NewEmailAddress")}
        </span>
      </div>
      <div className="w-[408px] h-[52px]">
        <input
          type="text"
          value={email}
          placeholder="@example.com"
          className="rounded-[16px] bg-base-100 text-[16px] text-secondary font-normal w-[408px] h-[52px] pl-[15px] placeholder:text-base-content placeholder:text-left input-bordered shadow-[inset_0_4px_8px_0_rgb(0,0,0,0.5)]"
          onChange={(e) => handleChangeEmail(e.target.value)}
        />
      </div>
      <div className="w-[408px] h-[52px] mt-[20px] text-right">
        {email && <Error error={error || authError} />}
      </div>
      <div className="flex justify-center gap-4 mt-[20px] w-[179px] h-[48px] shrink-0">
        {isProcessing ? (
          <Loading className="w-6 h-6" />
        ) : (
          <Button
            disabled={!email || !!error}
            className="btn btn-block px-4 py-2 bg-primary rounded-[16px]
              text-base-white text-[20px] leading-4 font-normal hover:bg-primary hover:border-primary"
            onClick={() => onClickNext(email)}
          >
            {t("Label.Next")}
          </Button>
        )}
      </div>
    </ReauthTemplate>
  );
};

const Error = ({ error }: { error?: ErrorMessage | string }) => {
  if (typeof error === "string") {
    return (
      <div className={"font-semibold text-[12px] text-attention"}>{error}</div>
    );
  } else if (isErrorMessage(error)) {
    return <FirebaseAuthError error={error} />;
  }
};

export default NewEmail;
