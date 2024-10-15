import { auth } from "fetchers/firebase/client";
import { updatePassword } from "firebase/auth";
import { useState } from "react";
import { ErrorMessage } from "types/adminTypes";

const useUpdatePassword = () => {
  const [updating, setUpdating] = useState<boolean>(false);
  const [isSuccessfull, setIsSuccessfull] = useState<boolean>(false);
  const [error, setError] = useState<ErrorMessage | null>(null);

  const execute = async (password: string) => {
    setError(null);
    setIsSuccessfull(false);
    setUpdating(true);
    try {
      await updatePassword(auth.currentUser, password);
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

export default useUpdatePassword;
