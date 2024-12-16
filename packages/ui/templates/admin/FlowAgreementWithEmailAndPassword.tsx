import { getAuth, verifyPasswordResetCode } from "firebase/auth";
import useMailAuthForm from "hooks/useMailAuthForm";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { SetStateAction, useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { EMAIL_REGEX, ErrorMessage } from "types/adminTypes";
import FirebaseAuthError from "ui/atoms/FirebaseAuthError";
import BackLink from "ui/molecules/BackLink";
import { LoadingSpinnerButton } from "../AuthTemplate";

export const PageType = {
  FlowAccountCreation: 0,
  PasswordReset: 1,
  PasswordUpdate: 2,
} as const;
type PageType = (typeof PageType)[keyof typeof PageType];

type Props = {
  title: string;
  buttonText: string;
  email: string;
  isSubmitting: boolean;
  pageType: PageType;
  authError?: ErrorMessage;
  onClickBack?: () => void;
  onClickSubmit: (email: string, password: string) => void;
};

const availableSymbols = "!?@#$%^&*_-+=:;";
const symbolPattern = `${availableSymbols.replace("-", "\\-")}`;

const FlowAgreementWithEmailAndPassword = ({
  title,
  buttonText,
  email,
  isSubmitting,
  pageType,
  authError,
  onClickBack,
  onClickSubmit,
}: Props) => {
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const [
    emailStatus,
    setEmailStatus,
    passwordStatus,
    setPasswordStatus,
    passwordConfirmationStatus,
    setPasswordConfirmationStatus,
  ] = useMailAuthForm(email);
  const t = useTranslations("LogInSignUp");

  useEffect(() => {
    if (email) {
      validateEmail(email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getErrors = () => {
    return [
      emailStatus.error,
      passwordStatus.error,
      passwordConfirmationStatus.error,
    ];
  };

  const getPasswordError = (password: string) => {
    if (new RegExp(`[^A-Za-z0-9${symbolPattern}]`).test(password)) {
      return "パスワードに使用できない文字が含まれています";
    }
    return "";
  };

  const isSubmitButtonDisabled = () => {
    switch (pageType) {
      case PageType.FlowAccountCreation:
        return (
          !agreed || !passwordStatus.valid || !passwordConfirmationStatus.valid
        );
      case PageType.PasswordReset:
      case PageType.PasswordUpdate:
        return (
          !emailStatus.valid ||
          !passwordStatus.valid ||
          !passwordConfirmationStatus.valid
        );
      default:
        return false;
    }
  };

  const validateEmail = (email: string) => {
    if (email === "" || email.match(EMAIL_REGEX)) {
      setEmailStatus({ email, valid: true, error: "" });
    } else {
      setEmailStatus({
        email,
        valid: false,
        error: "メールアドレスの形式で入力してください",
      });
    }
  };

  const validatePassword = (password: string) => {
    const usedLargeLetter = /[A-Z]/.test(password);
    const usedSmallLetter = /[a-z]/.test(password);
    const usedNumber = /[0-9]/.test(password);
    const usedSymbol = new RegExp(`[${symbolPattern}]`).test(password);
    const validationStepCount =
      (usedLargeLetter ? 1 : 0) +
      (usedSmallLetter ? 1 : 0) +
      (usedNumber ? 1 : 0) +
      (usedSymbol ? 1 : 0);
    const usedThreeOrMoreCharacterTypes = validationStepCount >= 3;
    const isValidLength = password.length >= 8;
    const error = getPasswordError(password);
    setPasswordStatus({
      password,
      usedLargeLetter,
      usedSmallLetter,
      usedNumber,
      usedSymbol,
      usedThreeOrMoreCharacterTypes,
      isValidLength,
      validationStepCount,
      valid: isValidLength && usedThreeOrMoreCharacterTypes && !error,
      error,
    });
    validatePasswordConfirmation(password, passwordConfirmationStatus.password);
  };

  const validatePasswordConfirmation = (
    password: string,
    passwordConfirmation: string,
  ) => {
    if (password !== "" && passwordConfirmation !== "") {
      if (password === passwordConfirmation) {
        setPasswordConfirmationStatus({
          password: passwordConfirmation,
          valid: true,
          error: "",
        });
      } else {
        setPasswordConfirmationStatus({
          password: passwordConfirmation,
          valid: false,
          error: t("PasswordsDoNotMatch"),
        });
      }
    } else {
      setPasswordConfirmationStatus({
        password: passwordConfirmation,
        valid: false,
        error: "",
      });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-full">
          <BackLinkBlock
            visible={pageType !== PageType.PasswordReset}
            onClickBack={onClickBack}
          />
        </div>
        <TitleLogoImage pageType={pageType} />
        <div className={"text-[32px] h-[80px] mt-[30px] font-bold"}>
          {title}
        </div>
        <div className={"mt-[10px]"}>
          <PasswordValidation {...passwordStatus} />
        </div>
        <div className={"mt-[30px]"}>
          <EmailField
            email={emailStatus.email}
            visible={
              pageType === PageType.PasswordReset ||
              pageType === PageType.PasswordUpdate
            }
            validateEmail={validateEmail}
            disable={PageType.PasswordReset ? true : false}
          />
        </div>
        <div
          className={"w-[412px] mt-[10px] font-medium text-[16px] text-left"}
        >
          {t("Password")}
        </div>
        <div className="relative mt-[10px]">
          <input
            type={showPassword ? "text" : "password"}
            value={passwordStatus.password}
            className="rounded-lg bg-slate-100 w-[408px] h-[52px] pl-[15px] placeholder:text-center input-bordered shadow-[inset_0_2px_4px_0_rgb(0,0,0,0.3)]"
            onChange={(e) => {
              validatePassword(e.target.value);
            }}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute top-1/2 right-4 transform -translate-y-1/2"
          >
            {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
          </button>
        </div>
        <div
          className={"w-[412px] mt-[10px] font-medium text-[16px] text-left"}
        >
          {t("ConfirmPassword")}
        </div>
        <div className="relative mt-[10px]">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={passwordConfirmationStatus.password}
            className="rounded-lg bg-slate-100 w-[408px] h-[52px] pl-[15px] placeholder:text-center input-bordered shadow-[inset_0_2px_4px_0_rgb(0,0,0,0.3)]"
            onChange={(e) => {
              validatePasswordConfirmation(
                passwordStatus.password,
                e.target.value,
              );
            }}
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute top-1/2 right-4 transform -translate-y-1/2"
          >
            {showConfirmPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
          </button>
        </div>
        <div className={"mt-[30px]"}>
          <Error errors={getErrors()} />
        </div>
        <div className={"mt-[30px]"}>
          <TermsOfService
            agreed={agreed}
            visible={pageType === PageType.FlowAccountCreation}
            setAgreed={setAgreed}
          />
        </div>
        <div className={"mt-[10px]"}>
          {authError && <FirebaseAuthError error={authError} />}
        </div>
        <div className={"mt-[20px]"}>
          <LoadingSpinnerButton
            label={buttonText}
            loading={isSubmitting}
            disabled={isSubmitButtonDisabled()}
            onClick={() =>
              onClickSubmit(emailStatus.email, passwordStatus.password)
            }
          />
        </div>
      </div>
    </>
  );
};
// isPasswordResetがfalseだったら、BackLinkコンポーネントを表示する
const BackLinkBlock = ({
  visible,
  onClickBack,
}: {
  visible: boolean;
  onClickBack?: () => void;
}) => {
  if (!visible) {
    return <></>;
  }
  return <BackLink onClickBack={onClickBack} />;
};

const TitleLogoImage = ({ pageType }: { pageType: PageType }) => {
  if (pageType === PageType.FlowAccountCreation) {
    return (
      <Image
        src={"/admin/images/tobiratory-flow.svg"}
        alt={"link tobiratory account with flow account"}
        width={313}
        height={114}
      />
    );
  }

  return (
    <Image
      src={"/admin/images/tobiratory-logo.svg"}
      alt={"Tobiratory logo"}
      width={110}
      height={114}
    />
  );
};

const EmailField = ({
  email,
  visible,
  validateEmail,
  disable,
}: {
  email: string;
  visible: boolean;
  disable?: boolean;
  validateEmail: (email: string) => void;
}) => {
  const t = useTranslations("LogInSignUp");
  if (!visible) {
    return <></>;
  }

  return (
    <>
      <div>{t("Email")}</div>
      <input
        type={"text"}
        value={email}
        className="rounded-lg bg-slate-100 w-[408px] h-[52px] mt-[10px] pl-[15px] placeholder:text-center input-bordered shadow-[inset_0_2px_4px_0_rgb(0,0,0,0.3)]"
        onChange={(e) => {
          validateEmail(e.target.value);
        }}
        disabled={disable}
      />
    </>
  );
};

export const TermsOfService = ({
  agreed,
  visible,
  setAgreed,
}: {
  agreed: boolean;
  visible: boolean;
  setAgreed: (value: SetStateAction<boolean>) => void;
}) => {
  const t = useTranslations("LogInSignUp");

  if (!visible) {
    return <></>;
  }

  return (
    <div className={"flex flex-row items-center"}>
      <input
        type={"checkbox"}
        checked={agreed}
        className={
          "checkbox w-[16px] h-[16px] rounded bg-slate-200 shadow-[inset_0_2px_4px_0_rgb(0,0,0,0.3)]"
        }
        onChange={() => setAgreed((prev) => !prev)}
      />
      <span className={"font-medium text-[12px]"}>
        <a
          href={"https://www.tobiratory.com/about"}
          className={"text-primary ml-[5px] font-medium text-[12px]"}
          target="_blank"
          rel="noreferrer"
        >
          {t("Terms")}
        </a>
        {t("AgreeToTerms")}
      </span>
    </div>
  );
};

const PasswordValidation = ({
  isValidLength,
  validationStepCount,
  usedThreeOrMoreCharacterTypes,
}: {
  isValidLength: boolean;
  validationStepCount: number;
  usedThreeOrMoreCharacterTypes: boolean;
}) => {
  const t = useTranslations("LogInSignUp");
  return (
    <div>
      <div className={"flex flex-row justify-center"}>
        <ValidationIcon
          valid={isValidLength}
          alt={"alphanumeric and special characters, minimum 8 characters."}
        />
        <div className={"ml-[7px] text-[12px]"}>
          {t("PasswordRequirements")}
        </div>
      </div>
      <div className={"flex flex-row justify-center mt-[5px]"}>
        <ValidationIcon
          valid={usedThreeOrMoreCharacterTypes}
          alt={"alphanumeric and special characters, minimum 8 characters."}
        />
        <div className={"ml-[7px] text-[12px]"}>
          {t("PasswordCharacterTypes")}
        </div>
      </div>
      <ul className={"grid grid-cols-2 gap-2 mt-[10px]"}>
        <li>
          <div className={"font-normal text-[12px]"}>
            ・{t("UppercaseLetters")}
          </div>
        </li>
        <li>
          <div className={"text-right font-normal text-[12px]"}>
            ・{t("Numbers")}
          </div>
        </li>
        <li>
          <div className={"font-normal text-[12px]"}>
            ・{t("LowercaseLetters")}
          </div>
        </li>
        <li>
          <div className={"text-right font-normal text-[12px]"}>
            ・{t("Symbols")}({availableSymbols})
          </div>
        </li>
      </ul>
      <div className={"flex flex-row justify-center mt-[10px]"}>
        <ValidationProgressBars step={validationStepCount} />
      </div>
    </div>
  );
};

const ValidationIcon = ({ valid, alt }: { valid: boolean; alt: string }) => {
  const validIcon = "check.svg";
  const invalidIcon = "cross.svg";
  return (
    <Image
      src={`/admin/images/icon/${valid ? validIcon : invalidIcon}`}
      alt={alt}
      width={16}
      height={16}
    />
  );
};

const ValidationProgressBars = ({ step }: { step: number }) => {
  const activeIcon = "active-bar.svg";
  const inactiveIcon = "inactive-bar.svg";
  const activeAlt = "active";
  const inactiveAlt = "inactive";
  return (
    <div className={"grid grid-cols-3 gap-x-[6px]"}>
      <ValidationProgressBar valid={step > 0} />
      <ValidationProgressBar valid={step > 1} />
      <ValidationProgressBar valid={step > 2} />
    </div>
  );
};

const ValidationProgressBar = ({ valid }: { valid: boolean }) => {
  const activeIcon = "active-bar.svg";
  const inactiveIcon = "inactive-bar.svg";
  const activeAlt = "active";
  const inactiveAlt = "inactive";
  return (
    <Image
      src={`/admin/images/icon/${valid ? activeIcon : inactiveIcon}`}
      alt={valid ? activeAlt : inactiveAlt}
      width={96}
      height={8}
    />
  );
};

const Error = ({ errors }: { errors: string[] }) => {
  return (
    <div className={"w-[412px] text-right"}>
      {errors.map((error, index) => {
        if (error) {
          return (
            <p
              key={index}
              className="pl-2 pt-1 font-medium text-[12px] text-attention"
            >
              {error}
            </p>
          );
        }
      })}
    </div>
  );
};

export default FlowAgreementWithEmailAndPassword;
