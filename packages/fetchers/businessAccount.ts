import { useState } from "react";
import { TcpFormType } from "types/adminTypes";
import { auth } from "./firebase/client";

export const useTcpRegistration = () => {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const registerTcp = async (data: TcpFormType) => {
    try {
      setLoading(true);
      setError(null);
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch(
        `/backend/api/functions/native/my/business/submission`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );
      if (res.ok) {
        const resData = await res.json();
        console.log(resData);
        setResponse(resData);
      } else {
        const resData = await res.text();
        setError(resData);
      }
    } catch (error) {
      setError(String(error));
    }
    setLoading(false);
  };

  return [registerTcp, response, loading, error] as const;
};
