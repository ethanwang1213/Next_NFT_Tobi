import { auth } from "fetchers/firebase/client";
import { unlink, User } from "firebase/auth";
import { useState } from "react";
import { ErrorMessage } from "types/adminTypes";

const useUnlinkProvider = () => {
  const [result, setResult] = useState<User | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<ErrorMessage | null>(null);
  const process = async (providerId: string) => {
    setError(null);
    setResult(null);
    setProcessing(true);
    try {
      const result = await unlink(auth.currentUser, providerId);
      setResult(result);
    } catch (error) {
      setError({ code: error.code, message: error.message });
    }
    setProcessing(false);
  };
  return [process, processing, result, error] as const;
};

export default useUnlinkProvider;
