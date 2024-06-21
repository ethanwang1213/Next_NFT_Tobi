"use client";
import { app } from "fetchers/firebase/client";
import { getMessaging, getToken } from "firebase/messaging";
import { useEffect, useState } from "react";

const useFcmToken = () => {
  const [token, setToken] = useState("");
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState("");

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
          const messaging = getMessaging(app);

          // Request notification permission
          const permission = await Notification.requestPermission();
          setNotificationPermissionStatus(permission);

          if (permission === "granted") {
            const currentToken = await getToken(messaging, {
              vapidKey:
                "BD7Vb0BBbro_ek34a3Nurw9N296Fvl5Cgmf4CkaCcamAuq8o7_GCuVRhl7r-ygv319Bro4uKBDDysA0eu-Kb_Yg", // Replace with your Firebase project's VAPID key
            });
            if (currentToken) {
              setToken(currentToken);
            } else {
              console.log(
                "No registration token available. Request permission to generate one.",
              );
            }
          }
        }
      } catch (error) {
        console.log("Error retrieving token:", error);
      }
    };

    retrieveToken();
  }, []);

  return { token, notificationPermissionStatus };
};

export default useFcmToken;
