import useMailAuthForm from "journal-pkg/hooks/useMailAuthForm";
import { ErrorMessage } from "journal-pkg/types/journal-types";
import { getFirebaseAuthErrorMessage } from "journal-pkg/ui/atoms/FirebaseAuthError";
import BackLinkBlock from "journal-pkg/ui/molecules/BackLinkBlock";
import { LoadingButton } from "journal-pkg/ui/templates/AuthTemplate";
import Image from "next/image";

type Props = {
  title: string;
  buttonText: string;
  email: string;
  isSubmitting: boolean;
  isPasswordReset: boolean;
  authError?: ErrorMessage;
  onClickBack?: () => void;
  onClickSubmit: (email: string, password: string) => void;
};

const availableSymbols = "!@#$%^&*_-+=:;";
const symbolPattern = `${availableSymbols.replace("-", "\\-")}`;

const EmailAndPasswordSignUp = ({
  title,
  buttonText,
  email,
  isSubmitting,
  isPasswordReset,
  authError,
  onClickBack,
  onClickSubmit,
}: Props) => {
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
      getFirebaseAuthErrorMessage(authError),
    ];
  };

  const getPasswordError = (password: string) => {
    if (new RegExp(`[^A-Za-z0-9${symbolPattern}]`).test(password)) {
      return "The password contains invalid characters.";
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
    return !passwordStatus.valid || !passwordConfirmationStatus.valid;
  };

  const validateEmail = (email: string) => {
    if (email === "" || email.match(/^[\w\-._+]+@[\w\-._]+\.[A-Za-z]+/)) {
      setEmailStatus({ email, valid: true, error: "" });
    } else {
      setEmailStatus({
        email,
        valid: false,
        error: "Please enter the email address in the correct format.",
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
          error: "The password do not match.",
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
      <div className="w-full">
        <BackLinkBlock
          title={title}
          fontSize={"medium"}
          visible={!isPasswordReset}
          onClickBack={onClickBack}
        />
      </div>
      <div className={"mt-[20px]"}>
        <PasswordValidation {...passwordStatus} />
      </div>
      <div className={"mt-[30px]"}>
        {isPasswordReset && (
          <EmailField email={emailStatus.email} validateEmail={validateEmail} />
        )}
      </div>
      <div
        className={
          "w-[412px] mt-[10px] font-bold text-neutral-main text-[16px] text-left"
        }
      >
        Password
      </div>
      <input
        type={"password"}
        value={passwordStatus.password}
        placeholder={"Password"}
        className="input rounded-[56px] bg-slate-100 w-[408px] mt-[10px] pl-[15px]
          text-sm sm:text-[16px] placeholder:text-sm sm:placeholder:text-[16px]
          text-neutral-main  font-bold placeholder:font-bold h-[48px]"
        onChange={(e) => {
          validatePassword(e.target.value);
        }}
      />
      <div
        className={
          "w-[412px] mt-[10px] font-bold text-neutral-main text-[16px] text-left"
        }
      >
        Confirmation (Re-entry)
      </div>
      <input
        type={"password"}
        value={passwordConfirmationStatus.password}
        placeholder={"Confirmation (Re-entry)"}
        className="input rounded-[56px] bg-slate-100 w-[408px] mt-[10px] pl-[15px]
          text-sm sm:text-[16px] placeholder:text-sm sm:placeholder:text-[16px]
          text-neutral-main font-bold placeholder:font-bold h-[48px]"
        onChange={(e) => {
          validatePasswordConfirmation(passwordStatus.password, e.target.value);
        }}
      />
      <div className={"h-[50px] mt-[5px]"}>
        <Error errors={getErrors()} />
      </div>
      <div>
        <LoadingButton
          label={buttonText}
          isPasswordReset={isPasswordReset}
          loading={isSubmitting}
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
  validateEmail,
}: {
  email: string;
  validateEmail: (email: string) => void;
}) => {
  return (
    <>
      <div
        className={
          "w-[412px] mt-[10px] font-bold text-neutral-main text-[16px] text-left"
        }
      >
        Mail Address
      </div>
      <input
        type={"text"}
        value={email}
        className="input rounded-[56px] bg-slate-100 w-[408px] mt-[10px] pl-[15px] placeholder:text-center
          text-sm sm:text-[16px] placeholder:text-sm sm:placeholder:text-[16px]
          text-neutral-main placeholder:text-neutral-main font-bold placeholder:font-bold h-[48px]"
        onChange={(e) => {
          validateEmail(e.target.value);
        }}
      />
    </>
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
  return (
    <div>
      <div className={"flex flex-row justify-center"}>
        <ValidationIcon
          valid={isValidLength}
          alt={"alphanumeric and special characters, minimum 8 characters."}
        />
        <div className={"ml-[7px] text-[12px] text-neutral-main font-semibold"}>
          A string of 8 or more characters
        </div>
      </div>
      <div className={"flex flex-row justify-center mt-[5px]"}>
        <ValidationIcon
          valid={usedThreeOrMoreCharacterTypes}
          alt={"alphanumeric and special characters, minimum 8 characters."}
        />
        <div className={"ml-[7px] text-[12px] text-neutral-main font-semibold"}>
          Includes at least 3 of the following character types
        </div>
      </div>
      <ul className={"grid grid-cols-2 gap-2 mt-[10px]"}>
        <li>
          <div
            className={"font-normal text-center text-[12px] text-neutral-main"}
          >
            &bull; Uppercase letters
          </div>
        </li>
        <li>
          <div
            className={"font-normal text-center text-[12px] text-neutral-main"}
          >
            &bull; Numbers
          </div>
        </li>
        <li>
          <div
            className={"font-normal text-center text-[12px] text-neutral-main"}
          >
            &bull; Lowercase letters
          </div>
        </li>
        <li>
          <div
            className={"font-normal text-center text-[12px] text-neutral-main"}
          >
            &bull; Symbols ({availableSymbols})
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
      src={`/journal/images/icon/${valid ? validIcon : invalidIcon}`}
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
    <div className={"grid grid-cols-3 gap-x-[10px]"}>
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
      src={`/journal/images/icon/${valid ? activeIcon : inactiveIcon}`}
      alt={valid ? activeAlt : inactiveAlt}
      width={103}
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
            <p key={index} className="pl-2 font-bold text-[12px] text-error">
              {error}
            </p>
          );
        }
      })}
    </div>
  );
};

export default EmailAndPasswordSignUp;
