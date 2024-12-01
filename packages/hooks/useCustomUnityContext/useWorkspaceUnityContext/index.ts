import { useCallback } from "react";
import {
  SendSampleRemovalResult,
  UpdateIdValues,
  WorkspaceLoadData,
  WorkspaceSaveData,
} from "types/adminTypes";
import {
  DebugFlag,
  ItemType,
  ModelParams,
  SampleSaveData,
  TextureParam,
} from "types/unityTypes";
import {
  DefaultAcrylicBaseScaleRatio,
  DefaultItemMeterHeight,
} from "../constants";
import {
  MessageBodyForSavingSaidanData,
  NftModelGeneratedHandler,
  SaidanType,
  UndoneOrRedoneHandler,
  UnityMessageJson,
  UnitySceneType,
} from "../types";
import { useSaidanLikeUnityContextBase } from "../useSaidanLikeUnityContext";
import { useUnityMessageHandler } from "../useUnityMessageHandler";
import { useApplyAcrylicBaseScaleRatio } from "./useApplyAcrylicBaseScaleRatio";

type SaveDataGeneratedHandler = (
  workspaceSaveData: WorkspaceSaveData,
  updateIdValues: UpdateIdValues,
) => void;

type ItemThumbnailGeneratedHandler = (thumbnailBase64: string) => void;

type RemoveSampleRequestedHandler = (
  id: number,
  itemId: number,
  sendSampleRemovalResult: SendSampleRemovalResult,
) => void;

export const useWorkspaceUnityContext = ({
  sampleMenuX = -1,
  onSaveDataGenerated,
  onItemThumbnailGenerated,
  onRemoveSampleEnabled,
  onRemoveSampleDisabled,
  onRemoveSampleRequested,
  onActionUndone,
  onActionRedone,
  onNftModelGenerated,
}: {
  sampleMenuX?: number;
  onSaveDataGenerated?: SaveDataGeneratedHandler;
  onItemThumbnailGenerated?: ItemThumbnailGeneratedHandler;
  onRemoveSampleEnabled?: () => void;
  onRemoveSampleDisabled?: () => void;
  onRemoveSampleRequested?: RemoveSampleRequestedHandler;
  onActionUndone?: UndoneOrRedoneHandler;
  onActionRedone?: UndoneOrRedoneHandler;
  onNftModelGenerated?: NftModelGeneratedHandler;
}) => {
  const {
    // states
    unityProvider,
    isSceneOpen,
    isItemsLoaded,
    isDragging,
    selectedItem,
    isUndoable,
    isRedoable,
    // functions
    addEventListener,
    removeEventListener,
    postMessageToUnity,
    unload,
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
    requestNftModelGeneration,
    // event handlers
    handleSimpleMessage,
    handleSceneIsLoaded,
    handleDragPlacingStarted,
    handleDragPlacingEnded,
    handleRemoveItemEnabled,
    handleRemoveItemDisabled,
    handleItemSelected,
    handleActionRegistered,
    handleActionUndone,
    handleActionRedone,
    handleNftModelGenerated,
    handleMouseUp,
    handleLoadingCompleted,
  } = useSaidanLikeUnityContextBase({
    sceneType: UnitySceneType.Workspace,
    itemMenuX: sampleMenuX,
    onRemoveItemEnabled: onRemoveSampleEnabled,
    onRemoveItemDisabled: onRemoveSampleDisabled,
    onActionUndone,
    onActionRedone,
    onNftModelGenerated,
  });

  // functions
  const processLoadData = useCallback((loadData: WorkspaceLoadData) => {
    console.log(loadData);
    if (loadData == null) return null;

    var saidanItemList = loadData.workspaceItemList.map((v) => {
      return {
        ...v,
        itemType: ItemType.Sample,
        imageUrl: v.materialUrl,
        shelfSectionIndex: -1,
        acrylicBaseScaleRatio:
          v.acrylicBaseScaleRatio ?? DefaultAcrylicBaseScaleRatio,
        canScale: true,
        itemMeterHeight: DefaultItemMeterHeight,
        itemName: v.name,
      };
    });

    return {
      saidanId: -2,
      saidanType: SaidanType.Workspace,
      saidanUrl: "",
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

      var workspaceItemList: SampleSaveData[] =
        messageBody.saidanData.saidanItemList.map((v) => ({
          id: v.id,
          itemId: v.itemId,
          stageType: v.stageType,
          shelfSectionIndex: v.shelfSectionIndex,
          position: v.position,
          rotation: v.rotation,
          scale: v.scale,
          acrylicBaseScaleRatio: v.acrylicBaseScaleRatio,
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

  const { applyAcrylicBaseScaleRatio } = useApplyAcrylicBaseScaleRatio({
    postMessageToUnity,
  });

  useUnityMessageHandler({
    sceneType: UnitySceneType.Workspace,
    addEventListener,
    removeEventListener,
    handleSimpleMessage,
    handleSceneIsLoaded,
    handleSaveDataGenerated,
    handleItemThumbnailGenerated,
    handleNftModelGenerated,
    handleDragPlacingStarted,
    handleDragPlacingEnded,
    handleRemoveItemEnabled,
    handleRemoveItemDisabled,
    handleRemoveItemRequested: handleRemoveSampleRequested,
    handleItemSelected,
    handleActionRegistered,
    handleActionUndone,
    handleActionRedone,
    handleLoadingCompleted,
  });

  return {
    // states
    unityProvider,
    isSceneOpen,
    isItemsLoaded,
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
    applyAcrylicBaseScaleRatio,
    requestNftModelGeneration,
    handleMouseUp,
    unload,
  };
};
