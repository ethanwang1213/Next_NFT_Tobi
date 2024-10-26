import { auth } from "fetchers/firebase/client";
import { useState } from "react";
import { ApiProfileData } from "types/adminTypes";

export const fetchMyProfile = async () => {
  const idToken = await auth.currentUser.getIdToken();
  const res = await fetch(`https://asia-northeast1-tobiratory-f6ae1.cloudfunctions.net/native/my/profile`, {
  // const res = await fetch(`/backend/api/functions/native/my/profile`, {
      method: "GET",
      headers: {
        Authorization: idToken,
        "Content-Type": "application/json",
      },
  });
  const resData = await res.json();
  if (res.ok) {
    return resData;
  } else {
    console.log(resData);
    return resData;
  }
};

export const useTobiratoryAndFlowAccountRegistration = () => {
  const [response, setResponse] = useState<ApiProfileData>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const register = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await registerToTobiratoryAndFlowAccount();
      if (res.ok) {
        const resData = await res.json();
        if (resData.data.flow?.flowAddress) {
          // If Flow account is already registered, the account data is returned.
          setResponse(resData.data);
        } else {
          // Wait until the Flow account is created.
          const maxRetry = 100;
          const sleepTime = 10000; // 10 seconds
          for (let i = 0; i < maxRetry; i++) {
            await new Promise((resolve) => setTimeout(resolve, sleepTime));
            const profile = await fetchMyProfile();
            if (profile.data?.flow?.flowAddress) {
              setResponse(profile.data);
              setLoading(false);
              return;
            }
          }
          setError("Failed to register");
        }
      } else {
        const resData = await res.text();
        console.log(resData);
        setError("エラーが発生しました。もう一度お試し下さい。");
      }
    } catch (error) {
      console.log(String(error));
      setError("エラーが発生しました。もう一度お試し下さい。");
    }
    setLoading(false);
  };

  return [register, response, loading, error] as const;
};

const registerToTobiratoryAndFlowAccount = async () => {
  const idToken = await auth.currentUser.getIdToken();
  return await fetch(`/backend/api/functions/native/signup`, {
    method: "POST",
    headers: {
      Authorization: idToken,
      "Content-Type": "application/json",
    },
  });
};
