import { useState } from "react";

type EmailStatus = {
  email: string;
  valid: boolean;
  error: string;
};

type PasswordStatus = {
  password: string;
  usedLargeLetter: boolean;
  usedSmallLetter: boolean;
  usedNumber: boolean;
  usedSymbol: boolean;
  usedThreeOrMoreCharacterTypes: boolean;
  isValidLength: boolean;
  validationStepCount: number;
  valid: boolean;
  error: string;
};

type PasswordConfirmationStatus = {
  password: string;
  valid: boolean;
  error: string;
};

const useMailAuthForm = (email: string) => {
  const [emailStatus, setEmailStatus] = useState<EmailStatus>({
    email: email,
    valid: false,
    error: "",
  });
  const [passwordStatus, setPasswordStatus] = useState<PasswordStatus>({
    password: "",
    usedLargeLetter: false,
    usedSmallLetter: false,
    usedNumber: false,
    usedSymbol: false,
    usedThreeOrMoreCharacterTypes: false,
    isValidLength: false,
    validationStepCount: 0,
    valid: false,
    error: "",
  });
  const [passwordConfirmationStatus, setPasswordConfirmationStatus] =
    useState<PasswordConfirmationStatus>({
      password: "",
      valid: false,
      error: "",
    });

  return [
    emailStatus,
    setEmailStatus,
    passwordStatus,
    setPasswordStatus,
    passwordConfirmationStatus,
    setPasswordConfirmationStatus,
  ] as const;
};

export default useMailAuthForm;
