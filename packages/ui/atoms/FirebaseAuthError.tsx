import { useTranslations } from "next-intl";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { ErrorMessage } from "types/adminTypes";

type Props = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  error: ErrorMessage;
};
const FirebaseAuthError = ({ error }: Props) => {
  const t = useTranslations("FirebaseAuthError");
  const getErrorMessage = () => {
    if (!error || error.code === "auth/popup-closed-by-user") {
      return "";
    }

    switch (error.code) {
      case "auth/invalid-action-code":
        return t("InvalidActionCode");
      case "auth/invalid-email":
        return t("InvalidEmail");
      case "auth/email-already-in-use":
        return t("EmailAlreadyInUse");
      case "auth/credential-already-in-use":
        return t("CredentialAlreadyInUse");
      case "auth/user-not-found":
        return t("EmailOrPassWordIncorrect");
      case "auth/missing-password":
        return t("MissingPassword");
      case "auth/wrong-password":
        return t("EmailOrPassWordIncorrect");
      case "auth/too-many-requests":
        return t("TooManyRequests");
      case "auth/user-mismatch":
        return t("UserMismatch");
      case "auth/requires-recent-login":
        return t.rich("RequiresRecentLogin", {
          br: () => <br />,
        });
      default:
        return `${t("SomeError")}: ${error.code}: ${error.message}`;
    }
  };

  return (
    <div className={"font-semibold text-[12px] text-attention"}>
      {getErrorMessage()}
    </div>
  );
};

export default FirebaseAuthError;
