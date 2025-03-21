import { isFlowAccountProcessing } from "contexts/AdminAuthProvider";
import { auth } from "fetchers/firebase/client";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { ApiProfileData, FlowAccountStatus } from "types/adminTypes";

export const fetchMyProfile = async () => {
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
    console.error(resData);
    return resData;
  }
};

export const useTobiratoryAndFlowAccountRegistration = () => {
  const [response, setResponse] = useState<ApiProfileData>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations();
  const locale = useLocale();

  const register = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await registerToTobiratoryAndFlowAccount(locale);
      if (res.ok) {
        const resData = await res.json();
        if (resData.data.flow?.flowAddress) {
          // If Flow account is already registered, the account data is returned.
          setResponse(resData.data);
        } else {
          const waitResult = await waitFlowAccountCreation();
          if (waitResult) {
            setResponse(waitResult);
          } else {
            setError(t("LogInSignUp.FailedMessageToCreateFlowAccount"));
          }
        }
      } else {
        // The response may not always be in JSON format.
        const resData = await res.text();
        console.error(resData);
        try {
          const data = JSON.parse(resData);
          if (isFlowAccountProcessing(data.data)) {
            const waitResult = await waitFlowAccountCreation();
            if (waitResult) {
              setResponse(waitResult);
              return;
            }
          }
          setError(t("LogInSignUp.FailedMessageToCreateFlowAccount"));
        } catch {
          setError(t("Error.Retry"));
        }
      }
    } catch (error) {
      console.error(String(error));
      setError(t("Error.Retry"));
    }
    setLoading(false);
  };

  return [register, response, loading, error, setError] as const;
};

const registerToTobiratoryAndFlowAccount = async (locale: string) => {
  const idToken = await auth.currentUser.getIdToken(true);
  const res = await fetch(`/backend/api/functions/native/signup`, {
    method: "POST",
    headers: {
      Authorization: idToken,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return res;
  }

  const data = { locale };
  return await fetch(`/backend/api/functions/native/create-flow`, {
    method: "POST",
    headers: {
      Authorization: idToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const waitFlowAccountCreation = async () => {
  const maxRetry = 100;
  const sleepTime = 10000; // 10 seconds
  for (let i = 0; i < maxRetry; i++) {
    await new Promise((resolve) => setTimeout(resolve, sleepTime));
    const profile = await fetchMyProfile();
    if (profile.data?.flow?.flowAddress) {
      return profile.data;
    } else if (profile.data?.type === FlowAccountStatus.Error) {
      return false;
    }
  }
  return false;
};
