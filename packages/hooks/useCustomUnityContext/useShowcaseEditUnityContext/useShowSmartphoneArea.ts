import { useCallback } from "react";
import { MessageDestination } from "../types";

export const useShowSmartphoneArea = ({
  postMessageToUnity,
}: {
  postMessageToUnity: (gameObject: MessageDestination, message: string) => void;
}) => {
  const showSmartphoneArea = useCallback(() => {
    postMessageToUnity(
      "ShowSmartphoneAreaMessageReceiver",
      JSON.stringify({ isShown: true }),
    );
  }, [postMessageToUnity]);

  const hideSmartphoneArea = useCallback(() => {
    postMessageToUnity(
      "ShowSmartphoneAreaMessageReceiver",
      JSON.stringify({ isShown: false }),
    );
  }, [postMessageToUnity]);

  return {
    showSmartphoneArea,
    hideSmartphoneArea,
  };
};
