import { httpsCallable } from "firebase/functions";
import { functions } from "journal-pkg/fetchers/firebase/journal-client";
import { useState } from "react";

export const useAddingRedeemEmail = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const funcName = "journalNfts-sendConfirmationRedeemEmail";

  const func = async (email: string) => {
    const callable = httpsCallable<
      { email: string },
      number
    >(functions, funcName);
    setLoading(true);
    setError(null);
    const status = await callable({email}).catch((error) => {
      setError(error);
    });
    setLoading(false);
    return status
  };
  return [func, loading, error] as const;
};
