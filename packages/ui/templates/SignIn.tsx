import MailSentDialog from "ui/templates/MailSentDialog";
import SignInForm, { LoginFormType } from "ui/templates/SignInForm";

export type Props = {
  loading: boolean;
  dialogRef: React.MutableRefObject<HTMLDialogElement>;
  signIn: (data: LoginFormType) => void;
  withGoogle: () => Promise<void>;
  withApple: () => Promise<void>;
};

const SignIn = ({ loading, dialogRef, signIn, withGoogle, withApple }) => {
  return (
    <>
      <div className="flex items-center justify-center w-[100dvw] h-[100dvh] p-8 sm:p-10">
        <SignInForm
          loading={loading}
          signIn={signIn}
          withGoogle={withGoogle}
          withApple={withApple}
        />
      </div>
      <MailSentDialog dialogRef={dialogRef} />
    </>
  );
};

export default SignIn;
