import { useAuth } from "contexts/AdminAuthProvider";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Button from "ui/atoms/Button";
import { LoginWithAnotherAccount } from "ui/templates/admin/FlowAgreementWithSnsAccount";

type Props = {
  registered: boolean;
  error?: string;
  onClickRegister: () => void;
};
const FlowRegister = ({ registered, error, onClickRegister }: Props) => {
  const t = useTranslations("LogInSignUp");
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <Logo errorOccurred={!!error} />
      <div className={"mt-[50px]"}>
        <ProcessingStatus registered={registered} error={error} />
      </div>
      <div className={"mt-[15px]"}>
        <RegisterButton
          registered={registered}
          error={error}
          onClickRegister={onClickRegister}
        />
      </div>
      {error && (
        <div className="flex items-end grow">
          <LoginWithAnotherAccount />
        </div>
      )}
    </div>
  );
};

const ProcessingStatus = ({
  registered,
  error,
}: {
  registered: boolean;
  error?: string;
}) => {
  const t = useTranslations("LogInSignUp");
  const faildedDesc = t.rich("FailedDescriptionToCreateFlowAccount", {
    br: () => <br />,
  });

  if (registered) {
    return (
      <div className={"font-bold text-[32px]"}>{t("FlowAccountCreated")}</div>
    );
  }

  return (
    <>
      <div
        className={
          "flex flex-col items-center justify-center font-bold text-[20px] sm:text-[32px]"
        }
      >
        {error ? (
          t("FailedToCreateFlowAccount")
        ) : (
          <div className="flex text-[20px] sm:text-[32px]">
            <span> {t("CreatingFlowAccount")} </span>
            <span className="loading loading-dots loading-md"></span>
          </div>
        )}
      </div>
      <div
        className={`font-medium text-[14px] ${
          error ? "text-center" : ""
        } mt-[15px]`}
      >
        {error
          ? t("FailedMessageToCreateFlowAccount")
          : t("FlowAccountCreationNotice")}
      </div>
      <div className={"font-medium text-[14px] text-center mt-[100px]"}>
        {error ? faildedDesc : t("AccountCreationNotification")}
      </div>
    </>
  );
};

const RegisterButton = ({ registered, error, onClickRegister }: Props) => {
  const t = useTranslations("Label");
  const { finishFlowAccountRegistration } = useAuth();
  if (error) {
    return (
      <Button
        className="bg-primary text-primary-content w-[179px] h-[48px] rounded-2xl"
        onClick={onClickRegister}
      >
        <span className={"font-normal text-[20px]"}>{t("ReRegistration")}</span>
      </Button>
    );
  } else if (registered) {
    return (
      <Button
        className="bg-primary text-primary-content w-[179px] h-[48px] rounded-2xl"
        onClick={finishFlowAccountRegistration}
      >
        <span className={"font-normal text-[20px]"}>{t("Done")}</span>
      </Button>
    );
  }
  return <LoadingButton />;
};

export const LoadingButton = () => {
  const t = useTranslations("Label");
  return (
    <button
      type="button"
      className="bg-inactive text-inactive-content w-[179px] h-[48px] rounded-2xl"
      disabled
    >
      <div className={"flex flex-row items-center justify-center"}>
        <span className="loading loading-spinner loading-sm"></span>
        <span className="font-normal text-[20px] ml-[5px]">
          {t("Processing")}
        </span>
      </div>
    </button>
  );
};

const Logo = ({ errorOccurred }: { errorOccurred: boolean }) => {
  if (errorOccurred) {
    return (
      <Image
        src={"/admin/images/icon/report-problem.svg"}
        alt={"flow logo"}
        width={160}
        height={160}
        className={"mt-[90px]"}
      />
    );
  }

  return (
    <Image
      src={"/admin/images/flow-logo.svg"}
      alt={"flow logo"}
      width={160}
      height={160}
      className={"mt-[90px]"}
    />
  );
};

export default FlowRegister;
