import { auth } from "fetchers/firebase/client";
import { verifyBeforeUpdateEmail } from "firebase/auth";
import { useLocale } from "next-intl";
import { useState } from "react";
import { ErrorMessage } from "types/adminTypes";
import { getPathWithLocale } from "types/localeTypes";

const useUpdateEmail = () => {
  const [updating, setUpdating] = useState<boolean>(false);
  const [isSuccessfull, setIsSuccessfull] = useState<boolean>(false);
  const [error, setError] = useState<ErrorMessage | null>(null);
  const locale = useLocale();

  const execute = async (email: string, path: string) => {
    setError(null);
    setIsSuccessfull(false);
    setUpdating(true);
    const newPath = getPathWithLocale(locale, path);
    auth.languageCode = locale;
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/${newPath}`,
        handleCodeInApp: true,
      };
      await verifyBeforeUpdateEmail(
        auth.currentUser,
        email,
        actionCodeSettings,
      );
      setIsSuccessfull(true);
      setUpdating(false);
    } catch (error) {
      setError({ code: error.code, message: error.message });
      setUpdating(false);
      return false;
    }
    return true;
  };
  return [execute, updating, isSuccessfull, error] as const;
};

export default useUpdateEmail;
