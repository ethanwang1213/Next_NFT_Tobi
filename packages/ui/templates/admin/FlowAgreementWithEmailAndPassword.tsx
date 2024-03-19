import useMailAuthForm from "hooks/useMailAuthForm";
import Image from "next/image";
import { SetStateAction, useState } from "react";
import { ErrorMessage } from "types/adminTypes";
import Button from "ui/atoms/Button";
import FirebaseAuthError from "../../atoms/FirebaseAuthError";

type Props = {
  title: string;
  buttonText: string;
  email: string;
  isSubmitting: boolean;
  isPasswordReset: boolean;
  authError?: ErrorMessage;
  onClickSubmit: (email: string, password: string) => void;
};

const availableSymbols = "!@#$%^&*_-+=:;";
const symbolPattern = `${availableSymbols.replace("-", "\\-")}`;

const FlowAgreementWithEmailAndPassword = ({
  title,
  buttonText,
  email,
  isSubmitting,
  isPasswordReset,
  authError,
  onClickSubmit,
}: Props) => {
  const [agreed, setAgreed] = useState(false);
  const [
    emailStatus,
    setEmailStatus,
    passwordStatus,
    setPasswordStatus,
    passwordConfirmationStatus,
    setPasswordConfirmationStatus,
  ] = useMailAuthForm(email);

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
    if (isPasswordReset) {
      return (
        !emailStatus.valid ||
        !passwordStatus.valid ||
        !passwordConfirmationStatus.valid
      );
    }
    return (
      !agreed || !passwordStatus.valid || !passwordConfirmationStatus.valid
    );
  };

  const validateEmail = (email: string) => {
    if (email === "" || email.match(/^[\w\-._+]+@[\w\-._]+\.[A-Za-z]+/)) {
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
    const usedThreeOrMoreCharacterTypes =
      (usedLargeLetter ? 1 : 0) +
        (usedSmallLetter ? 1 : 0) +
        (usedNumber ? 1 : 0) +
        (usedSymbol ? 1 : 0) >=
      3;
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
      valid: usedThreeOrMoreCharacterTypes && !error,
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
          error: "パスワードが一致しません",
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
      <div className="flex flex-col items-center justify-center w-[100dvw] h-[100dvh] p-8">
        <Image
          src={"/admin/images/tobiratory-flow.svg"}
          alt={"link tobiratory account with flow account"}
          width={313}
          height={114}
        />
        <div className={"text-[32px]"}>{title}</div>
        <PasswordValidation {...passwordStatus} />
        <EmailField
          email={emailStatus.email}
          visible={isPasswordReset}
          validateEmail={validateEmail}
        />
        <div>パスワード</div>
        <input
          type={"password"}
          value={passwordStatus.password}
          className="rounded-2xl bg-slate-100 w-[408px] h-[52px] placeholder:text-center input-bordered"
          onChange={(e) => {
            validatePassword(e.target.value);
          }}
        />
        <div>確認（再入力）</div>
        <input
          type={"password"}
          value={passwordConfirmationStatus.password}
          className="rounded-2xl bg-slate-100 w-[408px] h-[52px] placeholder:text-center input-bordered"
          onChange={(e) => {
            validatePasswordConfirmation(
              passwordStatus.password,
              e.target.value,
            );
          }}
        />
        <Error errors={getErrors()} />
        <AboutFlowAccount visible={!isPasswordReset} />
        <TermsOfService
          agreed={agreed}
          visible={!isPasswordReset}
          setAgreed={setAgreed}
        />
        <FirebaseAuthError error={authError} />
        <SubmitButton
          buttonText={buttonText}
          isSubmitting={isSubmitting}
          disabled={isSubmitButtonDisabled()}
          onClick={() =>
            onClickSubmit(emailStatus.email, passwordStatus.password)
          }
        />
      </div>
    </>
  );
};

const EmailField = ({
  email,
  visible,
  validateEmail,
}: {
  email: string;
  visible: boolean;
  validateEmail: (email: string) => void;
}) => {
  if (!visible) {
    return <></>;
  }

  return (
    <>
      <div>メールアドレス</div>
      <input
        type={"text"}
        value={email}
        placeholder={"Email"}
        className="rounded-2xl bg-slate-100 w-[408px] h-[52px] placeholder:text-center input-bordered"
        onChange={(e) => {
          validateEmail(e.target.value);
        }}
      />
    </>
  );
};

const AboutFlowAccount = ({ visible }: { visible: boolean }) => {
  if (!visible) {
    return <></>;
  }

  return (
    <a
      href={"https://www.tobiratory.com/about"}
      className={"text-primary underline"}
      target="_blank"
      rel="noreferrer"
    >
      <div className={"flex flex-row items-baseline"}>
        <div
          className={"w-[12px] h-[12px] bg-primary"}
          style={{
            WebkitMaskImage: "url(/admin/images/info-icon.svg)",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            WebkitMaskSize: "contain",
          }}
        ></div>
        <div>Flowアカウントと連携するとできること</div>
      </div>
    </a>
  );
};

const TermsOfService = ({
  agreed,
  visible,
  setAgreed,
}: {
  agreed: boolean;
  visible: boolean;
  setAgreed: (value: SetStateAction<boolean>) => void;
}) => {
  if (!visible) {
    return <></>;
  }

  return (
    <div>
      <input
        type={"checkbox"}
        checked={agreed}
        onChange={() => setAgreed((prev) => !prev)}
      />
      <a
        href={"https://www.tobiratory.com/about"}
        className={"text-primary underline"}
        target="_blank"
        rel="noreferrer"
      >
        利用規約
      </a>
      に同意してトビラトリーアカウント、Flowアカウントを作成する。
    </div>
  );
};

const PasswordValidation = ({
  isValidLength,
  usedLargeLetter,
  usedSmallLetter,
  usedNumber,
  usedSymbol,
  usedThreeOrMoreCharacterTypes,
}: {
  isValidLength: boolean;
  usedLargeLetter: boolean;
  usedSmallLetter: boolean;
  usedNumber: boolean;
  usedSymbol: boolean;
  usedThreeOrMoreCharacterTypes: boolean;
}) => {
  return (
    <div>
      <div>
        <ul>
          <li>
            <div className={"flex flex-row"}>
              <ValidationIcon
                valid={isValidLength}
                alt={
                  "alphanumeric and special characters, minimum 8 characters."
                }
              />
              <span>英数記号8文字以上</span>
            </div>
          </li>
          <li>
            <div className={"flex flex-row"}>
              <ValidationIcon
                valid={usedLargeLetter}
                alt={"used large letter"}
              />
              <span>大文字を含む</span>
            </div>
          </li>
          <li>
            <div className={"flex flex-row"}>
              <ValidationIcon
                valid={usedSmallLetter}
                alt={"used small letter"}
              />
              <span>小文字を含む</span>
            </div>
          </li>
          <li>
            <div className={"flex flex-row"}>
              <ValidationIcon valid={usedNumber} alt={"used number"} />
              <span>数字を含む</span>
            </div>
          </li>
          <li>
            <div className={"flex flex-row"}>
              <ValidationIcon valid={usedSymbol} alt={"used symbol"} />
              <span>記号({availableSymbols})を含む</span>
            </div>
          </li>
          <li>
            <div className={"flex flex-row"}>
              <ValidationIcon
                valid={usedThreeOrMoreCharacterTypes}
                alt={"used three or more character types"}
              />
              <span>三種類以上の文字種を含む</span>
            </div>
          </li>
        </ul>
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

const Error = ({ errors }: { errors: string[] }) => {
  return (
    <>
      {errors.map((error, index) => {
        if (error) {
          return (
            <p key={index} className="pl-2 pt-1 text-xs text-error">
              {error}
            </p>
          );
        }
      })}
    </>
  );
};

const SubmitButton = ({
  buttonText,
  isSubmitting,
  disabled,
  onClick,
}: {
  buttonText: string;
  isSubmitting: boolean;
  disabled: boolean;
  onClick: () => void;
}) => {
  const buttonColor = () => {
    if (!disabled) {
      return "bg-primary text-primary-content";
    } else {
      return "bg-inactive text-inactive-content";
    }
  };
  if (!isSubmitting) {
    return (
      <Button
        className={`${buttonColor()} w-[179px] h-[48px] rounded-2xl`}
        disabled={disabled}
        onClick={onClick}
      >
        {buttonText}
      </Button>
    );
  }
  return <LoadingButton />;
};

const LoadingButton = () => {
  return (
    <button
      type="button"
      className="bg-inactive text-inactive-content w-[179px] h-[48px] rounded-2xl"
      disabled
    >
      <span className="loading loading-spinner loading-sm"></span>
      <span className="text-sm">しばらくお待ちください</span>
    </button>
  );
};

export default FlowAgreementWithEmailAndPassword;
