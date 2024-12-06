import useWASDKeys from "hooks/useWASDKeys";
import { useCallback, useEffect } from "react";
import { WasdParams } from "types/adminTypes";
import { MessageDestination } from "../types";

export const useWasd = ({
  isLoaded,
  isSceneOpen,
  postMessageToUnity,
}: {
  isLoaded: boolean;
  isSceneOpen: boolean;
  postMessageToUnity: (gameObject: MessageDestination, message: string) => void;
}) => {
  const wasdKeys = useWASDKeys();

  const inputWasd = useCallback(
    ({ wKey, aKey, sKey, dKey }: WasdParams) => {
      if (!isLoaded || !isSceneOpen) return;
      postMessageToUnity(
        "InputWasdMessageReceiver",
        JSON.stringify({ wKey, aKey, sKey, dKey }),
      );
    },
    [isLoaded, isSceneOpen, postMessageToUnity],
  );

  useEffect(() => {
    inputWasd(wasdKeys);
  }, [inputWasd, wasdKeys]);
};
