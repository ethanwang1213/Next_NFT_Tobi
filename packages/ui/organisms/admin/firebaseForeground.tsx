"use client";
import { app } from "fetchers/firebase/client";
import { getMessaging, onMessage } from "firebase/messaging";
import useFcmToken from "hooks/useFCMToken";
import { useEffect } from "react";
import { toast } from "react-toastify";

const MintNotification = ({ title, text }) => {
  return (
    <div className="p-[10px] bg-secondary-900 flex flex-col items-center gap-4">
      <span className="text-base text-base-white font-bold text-center">
        {title}
      </span>
      <span className="text-sm text-base-white font-normal text-center">
        {text}
      </span>
    </div>
  );
};

export default function FcmTokenComp() {
  const { token: fcmToken, notificationPermissionStatus } = useFcmToken();

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      if (notificationPermissionStatus === "granted") {
        const messaging = getMessaging(app);
        const unsubscribe = onMessage(messaging, (payload) => {
          console.log("Foreground push notification received:", payload);
          if (payload.data && payload.data.body) {
            const notificationObj = JSON.parse(payload.data.body);
            if (
              notificationObj["type"] &&
              notificationObj["type"] == "mintBegan"
            ) {
              toast(
                <MintNotification
                  title="NFT Minting Magic Happening Now!"
                  text="No worries, you can still tweak things around here while we mint your NFT."
                />,
                {
                  className: "mint-notification",
                },
              );
            }
            if (
              notificationObj["type"] &&
              notificationObj["type"] == "mintCompleted"
            ) {
              toast(
                <MintNotification
                  title="Your NFT is Ready to Rock!"
                  text="Hop over to your inventory in the app and see the new addition!"
                />,
                {
                  className: "mint-notification",
                },
              );
            }
          }
        });
        return () => {
          unsubscribe(); // Unsubscribe from the onMessage event on cleanup
        };
      }
    }
  }, [notificationPermissionStatus]);

  return null; // This component is primarily for handling foreground notifications
}
