import { useCallback } from "react";
import {
  SendSampleRemovalResult,
  UpdateIdValues,
  WorkspaceLoadData,
  WorkspaceSaveData,
} from "types/adminTypes";
import {
  DebugFlag,
  ItemSaveData,
  ItemType,
  ModelParams,
  TextureParam,
} from "types/unityTypes";
import { DefaultItemMeterHeight } from "./constants";
import {
  MessageBodyForSavingSaidanData,
  SaidanType,
  UndoneOrRedone,
  UnityMessageJson,
  UnitySceneType,
} from "./types";
import { useSaidanLikeUnityContextBase } from "./useSaidanLikeUnityContextBase";
import { useUnityMessageHandler } from "./useUnityMessageHandler";

type Props = {
  sampleMenuX?: number;
  onSaveDataGenerated?: (
    workspaceSaveData: WorkspaceSaveData,
    updateIdValues: UpdateIdValues,
  ) => void;
  onItemThumbnailGenerated?: (thumbnailBase64: string) => void;
  onRemoveSampleEnabled?: () => void;
  onRemoveSampleDisabled?: () => void;
  onRemoveSampleRequested?: (
    id: number,
    itemId: number,
    sendSampleRemovalResult: SendSampleRemovalResult,
  ) => void;
  onActionUndone?: UndoneOrRedone;
  onActionRedone?: UndoneOrRedone;
};

export const useWorkspaceUnityContext = ({
  sampleMenuX = -1,
  onSaveDataGenerated,
  onItemThumbnailGenerated,
  onRemoveSampleEnabled,
  onRemoveSampleDisabled,
  onRemoveSampleRequested,
  onActionUndone,
  onActionRedone,
}: Props) => {
  const {
    // states
    unityProvider,
    isLoaded,
    isDragging,
    selectedItem,
    isUndoable,
    isRedoable,
    // functions
    addEventListener,
    removeEventListener,
    postMessageToUnity,
    setLoadData: privateSetLoadData,
    requestSaveData,
    placeNewSample,
    placeNewSampleWithDrag,
    removeItem,
    updateIdValues,
    inputWasd,
    undoAction,
    redoAction,
    deleteAllActionHistory,
    pauseUnityInputs,
    resumeUnityInputs,
    // event handlers
    handleSimpleMessage,
    handleSceneIsLoaded,
    handleDragPlacingStarted,
    handleDragPlacingEnded,
    handleRemoveItemEnabled,
    handleRemoveItemDisabled,
    handleItemSelected,
    handleActionUndone,
    handleActionRedone,
  } = useSaidanLikeUnityContextBase({
    sceneType: UnitySceneType.Workspace,
    itemMenuX: sampleMenuX,
    onRemoveItemEnabled: onRemoveSampleEnabled,
    onRemoveItemDisabled: onRemoveSampleDisabled,
    onActionUndone,
    onActionRedone,
  });

  // functions
  const processLoadData = useCallback((loadData: WorkspaceLoadData) => {
    console.log(loadData);
    if (loadData == null) return null;

    var saidanItemList = loadData.workspaceItemList.map((v) => {
      return {
        itemId: v.sampleItemId,
        imageUrl: v.materialUrl,
        ...v,
        itemType: ItemType.Sample,
        canScale: true,
        itemMeterHeight: DefaultItemMeterHeight,
      };
    });

    return {
      saidanId: -2,
      saidanType: SaidanType.Workspace,
      saidanUrl: "todo:set-url-here",
      saidanItemList,
      saidanCameraData: {
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
        rotation: {
          x: 0,
          y: 0,
          z: 0,
        },
      },
      saidanSettings: {
        wallpaper: {
          tint: "",
        },
        floor: {
          tint: "",
        },
        lighting: {
          sceneLight: {
            tint: "",
            brightness: -1,
          },
          pointLight: {
            tint: "",
            brightness: -1,
          },
        },
      },
      isDebug: loadData.isDebug ? loadData.isDebug : false,
    };
  }, []);

  const setLoadData = useCallback(
    (loadData: WorkspaceLoadData) => {
      privateSetLoadData(processLoadData(loadData));
    },
    [privateSetLoadData, processLoadData],
  );

  const removeSample = useCallback(
    ({ id, itemId }: { id: number; itemId: number }) => {
      removeItem({
        itemType: ItemType.Sample,
        id,
        itemId,
      });
    },
    [removeItem],
  );

  const removeSamplesByItemId = useCallback(
    (itemIdList: number[]) => {
      const list = itemIdList.map((itemId) => ({
        itemType: ItemType.Sample,
        itemId,
      }));
      postMessageToUnity(
        "RemoveItemsMessageReceiver",
        JSON.stringify({ itemRefList: list }),
      );
    },
    [postMessageToUnity],
  );

  const sendRemovalResult = useCallback(
    (id: number, completed: boolean) => {
      postMessageToUnity(
        "RemovalResultMessageReceiver",
        JSON.stringify({
          itemType: ItemType.Sample,
          id,
          completed,
        }),
      );
    },
    [postMessageToUnity],
  );

  const requestItemThumbnail = useCallback(
    (params: ModelParams & TextureParam & DebugFlag) => {
      postMessageToUnity(
        "ItemThumbnailGenerationMessageReceiver",
        JSON.stringify({
          ...params,
        }),
      );
    },
    [postMessageToUnity],
  );

  // event handlers
  const handleSaveDataGenerated = useCallback(
    (msgObj: UnityMessageJson) => {
      if (!onSaveDataGenerated) return;

      const messageBody = JSON.parse(
        msgObj.messageBody,
      ) as MessageBodyForSavingSaidanData;

      if (!messageBody) return;

      var workspaceItemList: ItemSaveData[] =
        messageBody.saidanData.saidanItemList.map((v) => ({
          id: v.id,
          itemId: v.itemId,
          stageType: v.stageType,
          position: v.position,
          rotation: v.rotation,
          scale: v.scale,
        }));
      onSaveDataGenerated({ workspaceItemList }, updateIdValues);
    },
    [onSaveDataGenerated, updateIdValues],
  );

  const handleItemThumbnailGenerated = useCallback(
    (msgObj: UnityMessageJson) => {
      if (!onItemThumbnailGenerated) return;

      const messageBody = JSON.parse(msgObj.messageBody) as {
        base64Image: string;
      };

      if (!messageBody) return;

      onItemThumbnailGenerated(messageBody.base64Image);
    },
    [onItemThumbnailGenerated],
  );

  const handleRemoveSampleRequested = useCallback(
    (msgObj: UnityMessageJson) => {
      if (!onRemoveSampleRequested) return;

      const messageBody = JSON.parse(msgObj.messageBody) as {
        itemType: ItemType;
        id: number;
        itemId: number;
      };

      if (!messageBody) return;

      onRemoveSampleRequested(
        messageBody.id,
        messageBody.itemId,
        sendRemovalResult,
      );
    },
    [onRemoveSampleRequested, sendRemovalResult],
  );

  useUnityMessageHandler({
    addEventListener,
    removeEventListener,
    handleSimpleMessage,
    handleSceneIsLoaded,
    handleSaveDataGenerated,
    handleItemThumbnailGenerated,
    handleDragPlacingStarted,
    handleDragPlacingEnded,
    handleRemoveItemEnabled,
    handleRemoveItemDisabled,
    handleRemoveItemRequested: handleRemoveSampleRequested,
    handleItemSelected,
    handleActionUndone,
    handleActionRedone,
  });

  return {
    // states
    unityProvider,
    isLoaded,
    isDragging,
    selectedSample: !selectedItem
      ? null
      : {
          sampleItemId: selectedItem.itemId,
          digitalItemId: selectedItem.digitalItemId,
        },
    isUndoable,
    isRedoable,
    // functions
    setLoadData,
    requestSaveData,
    placeNewSample,
    placeNewSampleWithDrag,
    removeSample,
    removeSamplesByItemId,
    requestItemThumbnail,
    inputWasd,
    undoAction,
    redoAction,
    deleteAllActionHistory,
    pauseUnityInputs,
    resumeUnityInputs,
  };
};
