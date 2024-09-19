import { isPasswordAuthEnabled } from "contexts/AdminAuthProvider";
import { auth } from "fetchers/firebase/client";
import { FirebaseError } from "firebase/app";
import {
  sendEmailVerification,
  updateEmail as updateFirebaseEmail,
} from "firebase/auth";
import { useState } from "react";
import { ErrorMessage } from "types/adminTypes";

const useUpdateEmail = () => {
  const [updating, setUpdating] = useState<boolean>(false);
  const [isSuccessfull, setIsSuccessfull] = useState<boolean>(false);
  const [error, setError] = useState<ErrorMessage | null>(null);

  const reauthenticate = async (email: string, path: string) => {
    const actionCodeSettings = {
      url: `${window.location.origin}/${path}`,
      handleCodeInApp: true,
    };

    setError(null);
    setIsSuccessfull(false);
    setUpdating(true);
    try {
      await updateFirebaseEmail(auth.currentUser, email);
      await sendEmailVerification(auth.currentUser, actionCodeSettings);
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
