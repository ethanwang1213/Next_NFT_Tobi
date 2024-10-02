import { httpsCallable } from "firebase/functions";
import { functions } from "journal-pkg/fetchers/firebase/journal-client";
import { useState } from "react";

export const useRemovingRedeemEmail = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const funcName = "journalNfts-removeRedeemEmail";

  const func = async (email: string) => {
    const callable = httpsCallable<
      { email: string },
      Record<string, boolean> | null
    >(functions, funcName);
    setLoading(true);
    setError(null);
    await callable({email}).catch((error) => {
      setError(error);
    });
    setLoading(false);
  };
  return [func, loading, error] as const;
};
