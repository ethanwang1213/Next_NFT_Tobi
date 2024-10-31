import { DetailedHTMLProps, HTMLAttributes } from "react";
import { ErrorMessage } from "types/adminTypes";
import { useTranslations } from "next-intl";

type Props = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  error: ErrorMessage;
};
const FirebaseAuthError = ({ error }: Props) => {
  const t = useTranslations("LogInSignUp");
  const getErrorMessage = () => {
    if (!error) {
      return "";
    }
    switch (error.code) {
      case "auth/invalid-action-code":
        return "リンクの有効期限が切れているため、サインアップを再度行ってください";
      case "auth/invalid-email":
        return "リンクを送ったメールアドレスを入力してください";
      case "auth/email-already-in-use":
      case "auth/credential-already-in-use":
        return "The email address you entered is already in use.";
      case "auth/user-not-found":
        return "Tobiratoryアカウントが存在しません";
      case "auth/missing-password":
      case "auth/wrong-password":
        return t('PasswordsDoNotMatch');
      default:
        return `エラーが発生しました: エラーコード: ${error.code}: ${error.message}`;
    }
  };

  return (
    <div className={"font-semibold text-[12px] text-attention"}>
      {getErrorMessage()}
    </div>
  );
};

export default FirebaseAuthError;
