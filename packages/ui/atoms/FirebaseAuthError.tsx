import { DetailedHTMLProps, HTMLAttributes } from "react";
import { ErrorMessage } from "types/adminTypes";

type Props = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  error: ErrorMessage;
};
const FirebaseAuthError = ({ error }: Props) => {
  const getErrorMessage = () => {
    switch (error.code) {
      case "auth/invalid-action-code":
        return "リンクの有効期限が切れているため、サインアップを再度行ってください";
      case "auth/invalid-email":
        return "リンクを送ったメールアドレスを入力してください";
      case "auth/email-already-in-use":
        return "このメールアドレスは既に使用されています";
      case "auth/user-not-found":
        return "Tobiratoryアカウントが存在しません";
      case "auth/missing-password":
      case "auth/wrong-password":
        return "メールアドレス、又はパスワードが間違っています";
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
