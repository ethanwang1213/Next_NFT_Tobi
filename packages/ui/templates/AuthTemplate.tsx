import { faApple } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useForm } from "react-hook-form";
import Button from "ui/atoms/Button";
import EmailTextField from "ui/atoms/EmailTextField";
import LanguageSwitch from "../organisms/admin/LanguageSwitch";

export type LoginFormType = {
  email: string;
};

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
  const t = useTranslations("LogInSignUp");
  return (
    <div>
      <div className="flex items-center justify-center p-8 flex-col">
        <form
          className="mt-20 rounded-[40px] flex flex-col gap-5 items-center z-10 pt-[56px]"
          onSubmit={handleSubmit(withMail)}
        >
          <Image
            src={"/admin/images/tobiratory-name-logo.svg"}
            alt={"link tobiratory account with flow account"}
            width={320}
            height={96}
            className="w-full sm:w-[450px]"
          />
          <div className={"mt-20 w-full sm:w-[408px]"}>
            <GoogleButton label={googleLabel} onClick={withGoogle} />
          </div>
          <div className={"mt-1 w-full sm:w-[408px]"}>
            <AppleButton label={appleLabel} onClick={withApple} />
          </div>
          <div
            className="w-full flex flex-row items-center gap-7 text-primary
                before:border-t before:grow before:border-primary before:border-2
                after:border-t after:grow after:border-primary after:border-2"
          >
            <div className="font-normal text-2xl pb-[5px]">or</div>
          </div>
          <div className="w-full sm:w-[408px]">
            <EmailTextField
              placeholder={t("Email")}
              className="rounded-xl base-content font-normal w-full h-[48px] px-4 placeholder:text-base-content placeholder:text-left border-none shadow-[inset_0_2px_4px_0_rgb(0,0,0,0.3)]"
              register={register}
            />
            <div className={"text-right"}>
              <button
                type={"button"}
                className={"btn-link font-medium text-xs text-primary"}
                onClick={setAuthState}
              >
                {prompt}
              </button>
            </div>
            <p className="pl-2 pt-1 text-xs text-attention text-center mt-8">
              {errors.email && `${errors.email.message}`}
            </p>
          </div>
          <LoadingSpinnerButton
            type={"submit"}
            label={mailLabel}
            loading={loading}
          />
        </form>
        <div className="mt-12 z-10 border-[1px] border-solid border-input-color">
          <LanguageSwitch />
        </div>
      </div>
    </div>
  );
};

export const GoogleButton = ({
  label,
  autosize,
  disabled,
  onClick,
}: {
  label: string;
  autosize?: boolean;
  disabled?: boolean;
  onClick: () => Promise<void>;
}) => {
  return (
    <Button
      type={"button"}
      disabled={disabled}
      className={`${
        autosize ? "" : "w-full"
      } btn btn-block rounded-[16px] bg-base-100 hover:bg-base-100 border-2 border-base-content hover:border-base-content`}
      onClick={onClick}
    >
      <div className={"flex flex-row items-center w-full"}>
        <div className={"w-13"}>
          <Image
            src={"/admin/images/icon/google.svg"}
            alt={"google"}
            width={26}
            height={26}
          />
        </div>
        <div className={"grow font-normal text-lg ml-[10px]"}>{label}</div>
        {!autosize && <div className={"w-13"}></div>}
      </div>
    </Button>
  );
};

export const AppleButton = ({
  label,
  autosize,
  disabled,
  onClick,
}: {
  label: string;
  autosize?: boolean;
  disabled?: boolean;
  onClick: () => Promise<void>;
}) => {
  return (
    <Button
      type={"button"}
      disabled={disabled}
      className={`${
        autosize ? "" : "w-full"
      } btn btn-block rounded-[16px] bg-base-100 hover:bg-base-100 border-2 border-base-content hover:border-base-content`}
      onClick={onClick}
    >
      <div className={"flex flex-row items-center w-full"}>
        <div className={"w-13"}>
          <FontAwesomeIcon icon={faApple} size={"2x"} />
        </div>
        <div className={"grow font-normal text-lg ml-[10px]"}>{label}</div>
        {!autosize && <div className={"w-13"}></div>}
      </div>
    </Button>
  );
};

export const LoadingSpinnerButton = ({
  type,
  label,
  disabled,
  loading,
  onClick,
}: {
  type?: "button" | "submit" | "reset";
  label: string;
  disabled?: boolean;
  loading: boolean;
  onClick?: () => void;
}) => {
  if (loading) {
    return <span className={"loading loading-spinner text-info loading-md"} />;
  }
  return (
    <Button
      type={type ?? "button"}
      disabled={disabled ?? false}
      className={
        "btn btn-block btn-primary w-[179px] rounded-2xl text-md text-xl font-normal text-primary-content"
      }
      onClick={onClick}
    >
      <span className={"font-normal text-xl"}>{label}</span>
    </Button>
  );
};

export default AuthTemplate;
