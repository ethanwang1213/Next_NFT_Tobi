import { auth } from "fetchers/firebase/client";
import {
  sendEmailVerification, sendSignInLinkToEmail,
  updateEmail as updateFirebaseEmail,
} from "firebase/auth";
import { useState } from "react";
import { ErrorMessage } from "types/adminTypes";
import {hasPassword, PASSWORD_RESET_PATH} from "contexts/AdminAuthProvider";

const useUpdateEmail = () => {
  const [updating, setUpdating] = useState<boolean>(false);
  const [isSuccessfull, setIsSuccessfull] = useState<boolean>(false);
  const [error, setError] = useState<ErrorMessage | null>(null);

  const reauthenticate = async (email: string, path: string) => {
    setError(null);
    setIsSuccessfull(false);
    setUpdating(true);
    try {
      await updateFirebaseEmail(auth.currentUser, email);
      const usedPassword = await hasPassword(email);

      if (usedPassword) {
        const actionCodeSettings = {
          url: `${window.location.origin}/${path}`,
          handleCodeInApp: true,
        };
        await sendEmailVerification(auth.currentUser, actionCodeSettings);
      }else{
        const actionCodeSettings = {
          url: `${window.location.origin}/${PASSWORD_RESET_PATH}`,
          handleCodeInApp: true,
        };
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      }
      setIsSuccessfull(true);
      setUpdating(false);
    } catch (error) {
      setError({ code: error.code, message: error.message });
      setUpdating(false);
    }
  };
  return [reauthenticate, updating, isSuccessfull, error] as const;
};

export default useUpdateEmail;
