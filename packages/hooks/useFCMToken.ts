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
            navigator.serviceWorker
              .register("/admin/firebase-messaging-sw.js")
              .then(async (registration) => {
                const currentToken = await getToken(messaging, {
                  vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
                  serviceWorkerRegistration: registration,
                });
                if (currentToken) {
                  setToken(currentToken);
                } else {
                  console.log(
                    "No registration token available. Request permission to generate one.",
                  );
                }
              })
              .catch((error) => {
                console.error("Service Worker registration failed: ", error);
              });
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
