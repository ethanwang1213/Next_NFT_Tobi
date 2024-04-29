import { DetailedHTMLProps, HTMLAttributes } from "react";
import { ErrorMessage } from "types/adminTypes";

type Props = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  error?: ErrorMessage;
};

export const getFirebaseAuthErrorMessage = (error?: ErrorMessage) => {
  switch (error?.code) {
    case undefined:
      return "";
    case "auth/invalid-action-code":
      return "The sign-up link has expired. Please sign up again.";
    case "auth/invalid-email":
      return "Please enter the email address to which the link was sent.";
    case "auth/email-already-in-use":
      return "This email address is already in use.";
    case "auth/user-not-found":
      return "No Tobiratory account exists.";
    case "auth/missing-password":
    case "auth/wrong-password":
      return "The email address or password is incorrect.";
    default:
      return `An error occurred: Error code: ${error.code}: ${error.message}`;
  }
};

const FirebaseAuthError = ({ error }: Props) => {
  return (
    <div className={"font-bold text-[12px] text-error text-end"}>
      {getFirebaseAuthErrorMessage(error)}
    </div>
  );
};

export default FirebaseAuthError;
