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
    if (!error) {
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
        return t("UserNotFound");
      case "auth/missing-password":
        return t("MissingPassword");
      case "auth/wrong-password":
        return t("WrongPassword");
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
