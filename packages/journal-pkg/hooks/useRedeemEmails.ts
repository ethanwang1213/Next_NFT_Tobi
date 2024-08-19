import { httpsCallable } from "firebase/functions";
import { functions } from "journal-pkg/fetchers/firebase/journal-client";
import { useState } from "react";

export const useRedeemEmails = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, boolean>>({});

  const func = async () => {
    const callable = httpsCallable<
      undefined,
      Record<string, boolean> | null
    >(functions, "journalNfts-getRedeemEmails");
    setLoading(true);
    setError(null);
    await callable()
      .then((result) => {
        setValues(result.data ?? {});
      })
      .catch((error) => {
        setError(error);
      });
    setLoading(false);
  };
  return [func, values, loading, error] as const;
};
