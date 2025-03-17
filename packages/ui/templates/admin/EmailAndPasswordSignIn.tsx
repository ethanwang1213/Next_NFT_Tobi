import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ErrorMessage } from "types/adminTypes";
import FirebaseAuthError from "ui/atoms/FirebaseAuthError";
import BackLink from "ui/molecules/BackLink";
import { LoadingSpinnerButton } from "ui/templates/AuthTemplate";

type Props = {
  email: string;
  loading: boolean;
  error?: ErrorMessage;
  onClickBack: () => void;
  onClickPasswordReset: (email: string) => void;
  withMailSignIn: (email: string, password: string) => void;
};

const EmailAndPasswordSignIn = ({
  email,
  loading,
  error,
  onClickBack,
  onClickPasswordReset,
  withMailSignIn,
}: Props) => {
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const t = useTranslations("LogInSignUp");
  return (
    <>
      <div className="flex flex-col items-center justify-center p-8">
        <div className={"w-full sm:w-[408px]"}>
          <BackLink onClickBack={onClickBack} />
        </div>
        <Image
          src={"/admin/images/tobiratory-name-logo.svg"}
          alt={"link tobiratory account with flow account"}
          width={320}
          height={96}
          className="w-full sm:w-[450px]"
        />
        <div className={"text-[32px] h-[80px] mt-[50px] font-bold"}>
          {t("PasswordEntry")}
        </div>
        <div className="w-full sm:w-[408px] mt-[80px]">
          <input
            type={"text"}
            value={email}
            disabled={true}
            className="rounded-lg bg-disabled-field base-200-content font-normal w-full sm:w-[408px] h-[52px] mt-[10px] px-[15px] placeholder:text-center input-bordered shadow-[inset_0_2px_4px_0_rgb(0,0,0,0.3)]"
          />
          <div className="relative mt-[40px]">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Password"
              className="rounded-lg base-content font-normal w-full sm:w-[408px] h-[52px] px-[15px] placeholder:text-base-content placeholder:text-left input-bordered shadow-[inset_0_2px_4px_0_rgb(0,0,0,0.3)]"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-1/2 right-4 transform -translate-y-1/2"
            >
              {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
            </button>
          </div>
        </div>
        <div className={"w-full sm:w-[408px] mt-[10px] text-right"}>
          <button
            type={"button"}
            className={
              "btn-link font-semibold text-[12px] no-underline text-primary"
            }
            onClick={() => onClickPasswordReset(email)}
          >
            {t("ResetPassword")}
          </button>
        </div>
        <div className={"mt-[150px]"}>
          {error && <FirebaseAuthError error={error} />}
        </div>
        <div className={"mt-[10px]"}>
          <LoadingSpinnerButton
            label={t("LogIn")}
            disabled={!!!password}
            loading={loading}
            onClick={() => withMailSignIn(email, password)}
          />
        </div>
      </div>
    </>
  );
};

export default EmailAndPasswordSignIn;
