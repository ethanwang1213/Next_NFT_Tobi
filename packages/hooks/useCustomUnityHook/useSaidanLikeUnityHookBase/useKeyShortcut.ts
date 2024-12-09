import { useCallback, useEffect, useState } from "react";
import { useKey, useKeyPress } from "react-use";
import { WasdParams } from "types/adminTypes";
import { MessageDestination } from "../types";

export const useKeyShortcut = ({
  isLoaded,
  isSceneOpen,
  postMessageToUnity,
  handleCtrlZ,
  handleCtrlShiftZ,
  handleCtrlD,
  handleDelete,
}: {
  isLoaded: boolean;
  isSceneOpen: boolean;
  postMessageToUnity: (gameObject: MessageDestination, message: string) => void;
  handleCtrlZ?: () => void;
  handleCtrlShiftZ?: () => void;
  handleCtrlD?: () => void;
  handleDelete?: () => void;
}) => {
  const [ctrlPressed] = useKeyPress(
    (event) => event.key === "Control" || event.key === "Meta",
  );

  const { setWasdState } = useWasd({
    isLoaded,
    isSceneOpen,
    ctrlPressed,
    postMessageToUnity,
  });

  useKey(
    () => true,
    (event) => {
      event.preventDefault();
      if (event.repeat) return;
      if (ctrlPressed) {
        // ctrl + key
        switch (event.key) {
          case "z":
          case "Z":
            if (event.shiftKey) {
              handleCtrlShiftZ?.();
            } else {
              handleCtrlZ?.();
            }
            break;
          case "d":
            handleCtrlD?.();
            break;
        }
      } else {
        // key
        switch (event.key) {
          case "w":
          case "a":
          case "s":
          case "d":
            setWasdState(event.key, true);
            break;
          case "Delete":
          case "Backspace":
            handleDelete?.();
            break;
        }
      }
    },
    { event: "keydown" },
  );

  useKey(
    () => true,
    (event) => {
      event.preventDefault();
      switch (event.key) {
        case "w":
        case "a":
        case "s":
        case "d":
          setWasdState(event.key, false);
          break;
      }
    },
    { event: "keyup" },
  );
};

const useWasd = ({
  isLoaded,
  isSceneOpen,
  ctrlPressed,
  postMessageToUnity,
}: {
  isLoaded: boolean;
  isSceneOpen: boolean;
  ctrlPressed: boolean;
  postMessageToUnity: (gameObject: MessageDestination, message: string) => void;
}) => {
  const [wKey, setWKey] = useState<boolean>(false);
  const [aKey, setAKey] = useState<boolean>(false);
  const [sKey, setSKey] = useState<boolean>(false);
  const [dKey, setDKey] = useState<boolean>(false);

  const setWasdState = useCallback(
    (key: "w" | "a" | "s" | "d", state: boolean) => {
      switch (key) {
        case "w":
          setWKey(state);
          break;
        case "a":
          setAKey(state);
          break;
        case "s":
          setSKey(state);
          break;
        case "d":
          setDKey(state);
          break;
      }
    },
    [setWKey, setAKey, setSKey, setDKey],
  );

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
    if (ctrlPressed) {
      inputWasd({ wKey: false, aKey: false, sKey: false, dKey: false });
    } else {
      inputWasd({ wKey, aKey, sKey, dKey });
    }
  }, [inputWasd, wKey, aKey, sKey, dKey, ctrlPressed]);

  return { setWasdState };
};
