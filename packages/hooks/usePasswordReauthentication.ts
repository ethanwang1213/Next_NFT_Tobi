import { auth } from "fetchers/firebase/client";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  UserCredential,
} from "firebase/auth";
import { useState } from "react";
import { ErrorMessage } from "types/adminTypes";

const usePasswordReauthentication = () => {
  const [userCredential, setUserCredential] = useState<UserCredential | null>(
    null,
  );
  const [reauthenticating, setReauthenticating] = useState<boolean>(false);
  const [error, setError] = useState<ErrorMessage | null>(null);
  const reauthenticate = async (password: string) => {
    setError(null);
    setUserCredential(null);
    setReauthenticating(true);
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      password,
    );
    try {
      const userCredential = await reauthenticateWithCredential(
        auth.currentUser,
        credential,
      );
      setUserCredential(userCredential);
      setReauthenticating(false);
    } catch (error) {
      setError({ code: error.code, message: error.message });
      setReauthenticating(false);
    }
  };
  return [reauthenticate, reauthenticating, userCredential, error] as const;
};

export default usePasswordReauthentication;
