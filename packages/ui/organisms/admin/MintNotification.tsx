"use client";
import { useEffect } from "react";
import { toast } from "react-toastify";

// Define the props type for MintNotificationUI
interface MintNotificationUIProps {
  title: string;
  text: string;
}

// MintNotificationUI component
const MintNotificationUI: React.FC<MintNotificationUIProps> = ({ title, text }) => {
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

// Define the props type for MintNotification
interface MintNotificationProps {
    notificationType : String,
}

// MintNotification component
const MintNotification: React.FC<MintNotificationProps> = ({ notificationType }) => {
    if (notificationType) {
      switch (notificationType) {
        case "mintBegan":
          toast(
            <MintNotificationUI
              title="NFT Minting Magic Happening Now!"
              text="No worries, you can still tweak things around here while we mint your NFT."
            />,
            {
              className: "mint-notification",
            }
          );
          break;
        case "mintCompleted":
          toast(
            <MintNotificationUI
              title="Your NFT is Ready to Rock!"
              text="Hop over to your inventory in the app and see the new addition!"
            />,
            {
              className: "mint-notification",
            }
          );
          break;
        case "mintFailed":
          toast(
            <MintNotificationUI
              title="Mint failed"
              text="The daily transaction limit has been exceeded, so Mint could not be completed."
            />,
            {
              className: "mint-notification",
            }
          );
          break;
        default:
          break;
      }
    }
  return null; // This component does not render anything itself
};

export default MintNotification;
