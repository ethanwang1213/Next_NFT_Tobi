import { useCallback } from "react";
import { MessageDestination } from "../types";

export const useMouseUp = ({
  postMessageToUnity,
}: {
  postMessageToUnity: (gameObject: MessageDestination, message: string) => void;
}) => {
  const handleMouseUp = useCallback(() => {
    postMessageToUnity("MouseUpMessageReceiver", "");
  }, [postMessageToUnity]);

  return { handleMouseUp };
};
