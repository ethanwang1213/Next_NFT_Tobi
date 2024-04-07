import { auth, functions } from "fetchers/firebase/client";
import { httpsCallable } from "firebase/functions";
import { useState } from "react";
import { ApiProfileData } from "types/adminTypes";

export const fetchMyProfile = async () => {
  try {
    const idToken = await auth.currentUser.getIdToken();
    const res = await fetch(`/backend/api/functions/native/my/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const resData = await res.json();
      console.log(resData);
      return resData;
    } else {
      const resData = await res.json();
      console.log(resData);
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
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
      const callable = httpsCallable<{}, ApiProfileData>(
        functions,
        "native/signup",
      );
      const result = await callable();
      if (result.data.flow) {
        setResponse(result.data);
      } else {
        setError("Failed to register");
      }
    } catch (error) {
      setError(String(error));
    }
    setLoading(false);
  };

  return [register, response, loading, error] as const;
};
