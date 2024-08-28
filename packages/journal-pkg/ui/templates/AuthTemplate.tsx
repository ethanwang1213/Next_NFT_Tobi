import { faApple } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EMAIL_REGEX, LoginFormType } from "journal-pkg/types/journal-types";
import Image from "next/image";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";

export type Props = {
  loading: boolean;
  googleLabel: string;
  appleLabel: string;
  mailLabel: string;
  prompt: string;
  setAuthState: () => void;
  withMail: (data: LoginFormType) => void;
  withGoogle: () => Promise<void>;
  withApple: () => Promise<void>;
};

const AuthTemplate = ({
  loading,
  googleLabel,
  appleLabel,
  mailLabel,
  prompt,
  setAuthState,
  withMail,
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
      <form
        className="bg-white p-7 sm:p-10 rounded-[50px] sm:rounded-[66px] flex flex-col gap-5 items-center md:translate-x-[250px] max-w-[496px] z-10"
        onSubmit={handleSubmit(withMail)}
      >
        <SnsButton label={googleLabel} onClick={withGoogle}>
          <Image
            src="/journal/images/icon/google_journal.svg"
            alt="google"
            width={26}
            height={26}
          />
        </SnsButton>
        <SnsButton label={appleLabel} onClick={withApple}>
          <FontAwesomeIcon icon={faApple} size="xl" />
        </SnsButton>
        <div
          className="relative w-full mt-[10px] before:border-t before:grow before:border-secondary-main after:border-t after:grow after:border-secondary-main
                flex items-center text-center text-secondary-main gap-7"
        >
          <p className={"text-[24px] font-normal"}>or</p>
        </div>
        <div className="w-full">
          <input
            type="text"
            placeholder="Email"
            {...register("email", {
              required: {
                value: true,
                message: "Please input mail address.",
              },
              pattern: {
                value: EMAIL_REGEX,
                message:
                  "Please enter the email address in the correct format.",
              },
            })}
            className="input rounded-[56px] bg-slate-100 w-[408px]
                text-sm sm:text-[16px] placeholder:text-sm sm:placeholder:text-[16px]
                text-neutral-main font-bold placeholder:font-bold h-[48px] px-6"
          />
          <div className={"text-right"}>
            <button
              type={"button"}
              className={
                "btn-link no-underline font-bold text-[12px] text-secondary-main"
              }
              onClick={setAuthState}
            >
              {prompt}
            </button>
          </div>
          <p className="pl-2 pt-1 font-bold text-end text-[12px] text-error">
            {errors.email && `${errors.email.message}`}
          </p>
        </div>
        <LoadingButton
          type={"submit"}
          label={mailLabel}
          isPasswordReset={false}
          loading={loading}
        />
      </form>
    </>
  );
};

const SnsButton = ({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) => {
  return (
    <button
      className="btn btn-block rounded-[56px] mt-[10px] flex-row text-md w-[408px] sm:text-[20px] sm:font-bold sm:h-[48px]
                shadow-[0_5px_5.4px_0_rgba(0,0,0,0.25)]"
      type="button"
      onClick={onClick}
    >
      <div className="flex-none flex justify-end w-[50px]">{children}</div>
      <div className={"grow"}>{label}</div>
      <div className={"w-[50px]"}></div>
    </button>
  );
};

export const LoadingButton = ({
  type,
  label,
  isPasswordReset,
  loading,
  disabled,
  onClick,
}: {
  type?: "button" | "submit" | "reset";
  label: string;
  isPasswordReset: boolean;
  loading: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) => {
  if (loading) {
    return (
      <span className="loading loading-spinner text-info loading-md"></span>
    );
  }

  const buttonColor = isPasswordReset ? "bg-primary-main" : "bg-secondary-main";

  return (
    <>
      <div className="hidden hover:bg-primary-main hover:bg-secondary-main" />
      <button
        type={type ?? "button"}
        className={`btn btn-block rounded-[66px] border-0 w-[176px] h-[48px] ${buttonColor} hover:${buttonColor} disabled:bg-disabled-input disabled:text-disabled-input-content text-neutral
                text-[20px] font-bold shadow-[0_5px_5.4px_0_rgba(0,0,0,0.25)]`}
        disabled={disabled ?? false}
        onClick={onClick}
      >
        {label}
      </button>
    </>
  );
};

export default AuthTemplate;
