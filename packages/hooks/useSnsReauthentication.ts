import {AuthProvider, GoogleAuthProvider, OAuthProvider} from "@firebase/auth";
import { auth } from "fetchers/firebase/client";
import { reauthenticateWithPopup, UserCredential } from "firebase/auth";
import { useState } from "react";
import {ErrorMessage, ProviderId} from "types/adminTypes";

const getProvider = (providerId: string) => {
  switch (providerId) {
    case ProviderId.GOOGLE:
      return new GoogleAuthProvider();
    case ProviderId.APPLE:
      return new OAuthProvider(ProviderId.APPLE);
    default:
      return null;
  }
};

const useSnsReauthentication = () => {
  const [userCredential, setUserCredential] = useState<UserCredential | null>(
    null,
  );
  const [reauthenticating, setReauthenticating] = useState<boolean>(false);
  const [error, setError] = useState<ErrorMessage | null>(null);
  const reauthenticate = async (providerId: ProviderId) => {
    const provider = getProvider(providerId);
    setError(null);
    setUserCredential(null);
    setReauthenticating(true);
    try {
      const userCredential = await reauthenticateWithPopup(
        auth.currentUser,
        provider,
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

export default useSnsReauthentication;
