"use client";
import { app } from "fetchers/firebase/client";
import { getMessaging, onMessage } from "firebase/messaging";
import useFcmToken from "hooks/useFCMToken";
import { useEffect } from "react";

export default function FcmTokenComp() {
  const { token: fcmToken, notificationPermissionStatus } = useFcmToken();

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      if (notificationPermissionStatus === "granted") {
        const messaging = getMessaging(app);
        const unsubscribe = onMessage(messaging, (payload) =>
          console.log("Foreground push notification received:", payload),
        );
        return () => {
          unsubscribe(); // Unsubscribe from the onMessage event on cleanup
        };
      }
    }
  }, [notificationPermissionStatus]);

  return null; // This component is primarily for handling foreground notifications
}
