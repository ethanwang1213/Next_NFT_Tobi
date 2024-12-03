import { useCallback, useState } from "react";
import {
  ActionType,
  ItemName,
  ItemType,
  ParentId,
  Vector3,
} from "types/unityTypes";
import {
  MessageDestination,
  RequiredUndoneRedoneResult,
  UndoneOrRedoneHandler,
  UndoneRedoneResult,
  UnityMessageJson,
} from "../types";

export const useUndoRedo = ({
  additionalItemDataMap,
  onActionUndone,
  onActionRedone,
  postMessageToUnity,
}: {
  additionalItemDataMap: Map<ItemType, Map<number, ParentId & ItemName>>;
  onActionUndone?: UndoneOrRedoneHandler;
  onActionRedone?: UndoneOrRedoneHandler;
  postMessageToUnity: (gameObject: MessageDestination, message: string) => void;
}) => {
  const [isUndoable, setIsUndoable] = useState<boolean>(false);
  const [isRedoable, setIsRedoable] = useState<boolean>(false);

  // undo/redo
  const undoAction = useCallback(() => {
    postMessageToUnity("UndoActionMessageReceiver", "");
  }, [postMessageToUnity]);

  const redoAction = useCallback(() => {
    postMessageToUnity("RedoActionMessageReceiver", "");
  }, [postMessageToUnity]);

  const deleteAllActionHistory = useCallback(() => {
    postMessageToUnity("DeleteAllActionHistoryMessageReceiver", "");
    setIsUndoable(false);
    setIsRedoable(false);
  }, [postMessageToUnity]);

  /**
   * Process the result of undone or redone action.
   * Result data includes default values which are not necessary for a result ActionType.
   * So, this function processes the result data to remove default values.
   * Before:
   *   { item: { itemType, itemId, position, rotation, scale }, settings: { wallpaper, floor, lighting } }
   * After:
   *   e.g. redo TranslateItem -> { item: { itemType, itemId, position } }
   *   e.g. redo ChangeWallpaperColor -> { settings: { wallpaper: { tint } } }
   *   e.g. redo RemoveItem -> { item: { itemType, itemId } }
   */
  const removeDefaultValues = useCallback(
    (result: RequiredUndoneRedoneResult): UndoneRedoneResult => {
      // item
      // default values: { item: { itemType: ItemType.Sample, itemId: -1, position: { x: -999.0, y: -999.0, z: -999.0 }, rotation: { x: -999.0, y: -999.0, z: -999.0 }, scale: -1.0 } }

      // itemType, itemId
      const itemType = result.item.itemType;
      const itemId = result.item.itemId === -1 ? undefined : result.item.itemId;

      // position, rotation
      const isDefaultVec = (v: Vector3) => {
        return v.x === -999.0 && v.y === -999.0 && v.z === -999.0;
      };
      const position = isDefaultVec(result.item.position)
        ? undefined
        : result.item.position;
      const rotation = isDefaultVec(result.item.rotation)
        ? undefined
        : result.item.rotation;

      // scale
      const scale = result.item.scale === -1.0 ? undefined : result.item.scale;

      // merge item values
      const item = result.item
        ? itemId
          ? { itemType, itemId, position, rotation, scale }
          : undefined
        : undefined;

      // settings
      // default values: { settings: { wallpaper: { tint: "" }, floor: { tint: "" }, lighting: { sceneLight: { tint: "", brightness: -1.0 }, pointLight: { tint: "", brightness: -1.0 } } } }

      // wallpaper
      const wallpaper =
        result.settings.wallpaper.tint === ""
          ? undefined
          : { tint: result.settings.wallpaper.tint };

      // floor
      const floor =
        result.settings.floor.tint === ""
          ? undefined
          : { tint: result.settings.floor.tint };

      // sceneLight
      const resultSceneLight = result.settings.lighting.sceneLight;
      const sceneTint =
        resultSceneLight.tint === ""
          ? undefined
          : { tint: resultSceneLight.tint };
      const sceneBrightness =
        resultSceneLight.brightness === -1.0
          ? undefined
          : { brightness: resultSceneLight.brightness };
      const sceneLight =
        !sceneTint && !sceneBrightness
          ? undefined
          : { ...sceneTint, ...sceneBrightness };

      // pointLight
      const resultPointLight = result.settings.lighting.pointLight;
      const pointTint =
        resultPointLight.tint === ""
          ? undefined
          : { tint: resultPointLight.tint };
      const pointBrightness =
        resultPointLight.brightness === -1.0
          ? undefined
          : { brightness: resultPointLight.brightness };
      const pointLight =
        !pointTint && !pointBrightness
          ? undefined
          : { ...pointTint, ...pointBrightness };

      // merge lighting values
      const lighting =
        !sceneLight && !pointLight ? undefined : { sceneLight, pointLight };

      // merge settings values
      const settings = result.settings
        ? wallpaper || floor || lighting
          ? { wallpaper, floor, lighting }
          : undefined
        : undefined;

      return {
        item,
        settings,
      };
    },
    [],
  );

  const needReplaceItemName = (actionType: ActionType) =>
    actionType === ActionType.AddItem ||
    actionType === ActionType.RemoveItem ||
    actionType === ActionType.TranslateItem;

  const replaceItemNameOnText = useCallback(
    (notifText: string, itemName: string) =>
      itemName === ""
        ? notifText.replace("ITEM_NAME", "the Sample Item")
        : notifText.replace("ITEM_NAME", itemName),
    [],
  );

  const handleActionRegistered = useCallback(() => {
    setIsUndoable(true);
    setIsRedoable(false);
  }, [setIsUndoable]);

  const handleActionUndone = useCallback(
    (msgObj: UnityMessageJson) => {
      if (!onActionUndone) return;
      const messageBody = JSON.parse(msgObj.messageBody) as {
        actionType: ActionType;
        text: string;
        isUndoable: boolean;
        result: RequiredUndoneRedoneResult;
      };
      if (!messageBody) return;
      setIsUndoable(messageBody.isUndoable);
      setIsRedoable(true);

      const processedText = !needReplaceItemName(messageBody.actionType)
        ? messageBody.text
        : replaceItemNameOnText(
            messageBody.text,
            additionalItemDataMap
              .get(messageBody.result.item.itemType)
              ?.get(messageBody.result.item.itemId)?.itemName ?? "",
          );

      onActionUndone(
        messageBody.actionType,
        processedText,
        removeDefaultValues(messageBody.result),
      );
    },
    [
      additionalItemDataMap,
      onActionUndone,
      setIsUndoable,
      replaceItemNameOnText,
      removeDefaultValues,
    ],
  );

  const handleActionRedone = useCallback(
    (msgObj: UnityMessageJson) => {
      if (!onActionRedone) return;
      const messageBody = JSON.parse(msgObj.messageBody) as {
        actionType: ActionType;
        text: string;
        isRedoable: boolean;
        result: RequiredUndoneRedoneResult;
      };
      if (!messageBody) return;
      setIsRedoable(messageBody.isRedoable);
      setIsUndoable(true);

      const processedText = !needReplaceItemName(messageBody.actionType)
        ? messageBody.text
        : replaceItemNameOnText(
            messageBody.text,
            additionalItemDataMap
              .get(messageBody.result.item.itemType)
              ?.get(messageBody.result.item.itemId)?.itemName ?? "",
          );

      onActionRedone(
        messageBody.actionType,
        processedText,
        removeDefaultValues(messageBody.result),
      );
    },
    [
      additionalItemDataMap,
      onActionRedone,
      setIsRedoable,
      replaceItemNameOnText,
      removeDefaultValues,
    ],
  );

  return {
    isUndoable,
    isRedoable,
    undoAction,
    redoAction,
    deleteAllActionHistory,
    handleActionRegistered,
    handleActionUndone,
    handleActionRedone,
  };
};
