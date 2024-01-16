import { useForm } from "react-hook-form";
import MailSentDialog from "ui/organisms/admin/MailSentDialog";
import AppleIconButton from "../atoms/AppleIconButton";
import EmailTextField from "../atoms/EmailTextField";
import ImageIconButton from "../atoms/ImageIconButton";
import SubmitButton from "../atoms/SubmitButton";

export type LoginFormType = {
  email: string;
};

export type Props = {
  loading: boolean;
  dialogRef: React.MutableRefObject<HTMLDialogElement>;
  signIn: (data: LoginFormType) => void;
  withGoogle: () => Promise<void>;
  withApple: () => Promise<void>;
};

const SignIn = ({
  loading,
  dialogRef,
  signIn,
  withGoogle,
  withApple,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    defaultValues: {
      email: "",
    },
  });
  return (
    <>
      <div className="flex items-center justify-center w-[100dvw] h-[100dvh] p-8 sm:p-10">
        <form
          className="bg-white p-7 sm:p-10 rounded-[40px] sm:rounded-[50px] flex flex-col gap-5 items-center max-w-[400px] z-10"
          onSubmit={handleSubmit(signIn)}
        >
          <ImageIconButton
            label={"Sign in with Google"}
            type={"button"}
            imagePath={"/admin/images/icon/google.svg"}
            alt={"google"}
            buttonClassName={
              "btn-block rounded-full bg-white gap-3 flex-row text-md sm:text-lg sm:h-[56px] drop-shadow-[0_6px_8px_rgba(0,0,0,0.2)]"
            }
            iconClassName={"relative h-[50%] aspect-square"}
            onClick={withGoogle}
          />
          <AppleIconButton
            label={"Sign in with Apple"}
            size={"xl"}
            className={
              "btn-block rounded-full bg-white gap-3 flex-row text-md sm:text-lg sm:h-[56px] drop-shadow-[0_6px_8px_rgba(0,0,0,0.2)]"
            }
            onClick={withApple}
          />
          <div
            className="relative w-full before:border-t before:grow before:border-primary after:border-t after:grow after:border-primary
                flex items-center text-center gap-5 text-primary"
          >
            <p>or</p>
          </div>
          <div className="w-full">
            <EmailTextField
              placeholder={"Email"}
              className="rounded-full bg-slate-100 w-full input-bordered text-md sm:text-lg placeholder:text-sm sm:placeholder:text-md sm:h-[56px] px-6"
              register={register}
            />
            <p className="pl-2 pt-1 text-[10px] text-error">
              {errors.email && `${errors.email.message}`}
            </p>
          </div>
          <SubmitButton
            label={"Sign in"}
            loading={loading}
            buttonClassName={
              "btn-block btn-primary rounded-full text-md text-neutral sm:text-lg sm:h-[56px] drop-shadow-[0_6px_8px_rgba(0,0,0,0.2)]"
            }
            loadingClassName={"loading-spinner text-info loading-md"}
          />
        </form>
      </div>
      <MailSentDialog dialogRef={dialogRef} />
    </>
  );
};

export default SignIn;
