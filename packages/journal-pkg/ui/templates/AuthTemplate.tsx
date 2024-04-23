import { faApple } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useForm } from "react-hook-form";

type LoginFormType = {
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
  return (
    <>
      <form
        className="bg-white p-7 sm:p-10 rounded-[40px] sm:rounded-[50px] flex flex-col gap-5 items-center md:translate-x-[250px] max-w-[400px] z-10"
        onSubmit={handleSubmit(withMail)}
      >
        <button
          className="btn btn-block rounded-full gap-3 flex-row text-md sm:text-lg sm:h-[56px]
                drop-shadow-[0_6px_8px_rgba(0,0,0,0.2)]"
          type="button"
          onClick={withGoogle}
        >
          <div className="relative h-[50%] aspect-square">
            <Image
              src="/journal/images/icon/google_journal.svg"
              alt="google"
              fill
            />
          </div>
          {googleLabel}
        </button>
        <button
          className="btn btn-block rounded-full gap-3 flex-row text-md sm:text-lg sm:h-[56px]
            drop-shadow-[0_6px_8px_rgba(0,0,0,0.2)]"
          type="button"
          onClick={withApple}
        >
          <FontAwesomeIcon icon={faApple} size="xl" />
          {appleLabel}
        </button>
        <div
          className="relative w-full before:border-t before:grow before:border-black after:border-t after:grow after:border-black
                flex items-center text-center gap-5"
        >
          <p>or</p>
        </div>
        <div className="w-full">
          <input
            type="text"
            placeholder="Email"
            {...register("email", {
              required: {
                value: true,
                message: "*メールアドレスを入力してください。",
              },
              pattern: {
                value: /^[\w\-._+]+@[\w\-._]+\.[A-Za-z]+/,
                message: "*メールアドレスの形式で入力してください",
              },
            })}
            className="input rounded-full bg-slate-100 w-full input-bordered
                text-md sm:text-lg placeholder:text-sm sm:placeholder:text-md sm:h-[56px] px-6"
          />
          <div className={"text-right"}>
            <button
              type={"button"}
              className={"btn-link font-medium text-[12px] text-primary"}
              onClick={setAuthState}
            >
              {prompt}
            </button>
          </div>
          <p className="pl-2 pt-1 text-[10px] text-error">
            {errors.email && `${errors.email.message}`}
          </p>
        </div>
        <LoadingButton type={"submit"} label={mailLabel} loading={loading} />
        <p className="mt-2 w-full text-red-500 text-[10px] text-center">
          ※TOBIRA NEKO購入済みの方
          <br />
          受取には購入時に使用したメールアドレスでのログインが必要です。
        </p>
      </form>
    </>
  );
};

export const LoadingButton = ({
  type,
  label,
  loading,
  disabled,
  onClick,
}: {
  type?: "button" | "submit" | "reset";
  label: string;
  loading: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) => {
  if (loading) {
    return (
      <span className="loading loading-spinner text-info loading-md"></span>
    );
  }
  return (
    <button
      type={type ?? "button"}
      className="btn btn-block rounded-full text-md sm:text-lg sm:h-[56px]
                drop-shadow-[0_6px_8px_rgba(0,0,0,0.2)]"
      disabled={disabled ?? false}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default AuthTemplate;
