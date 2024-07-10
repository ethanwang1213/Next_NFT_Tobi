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
            let scriptURL = "/admin/firebase-messaging-sw.js";
            scriptURL += `?apiKey=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`;
            scriptURL += `&authDomain=${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}`;
            scriptURL += `&projectId=${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`;
            scriptURL += `&storageBucket=${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}`;
            scriptURL += `&messagingSenderId=${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}`;
            scriptURL += `&appId=${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}`;
            scriptURL += `&measurementId=${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}`;

            navigator.serviceWorker
              .register(scriptURL)
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
