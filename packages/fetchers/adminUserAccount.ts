import { auth } from "fetchers/firebase/client";
import { useState } from "react";
import { ApiProfileData } from "types/adminTypes";

export const fetchMyProfile = async () => {
  try {
    const idToken = await auth.currentUser.getIdToken();
    const res = await fetch(`/backend/api/functions/native/my/profile`, {
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
  } catch (error) {
    console.log(error);
    return error;
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
      const resData = await res.json();
      console.log(resData)
      if (res.ok){
        if (resData.data.flow) {
          setResponse(resData.data);
        } else {
          setError("Failed to register");
        }
      } else {
        setError(resData.data);
      }
    } catch (error) {
      setError(String(error));
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
