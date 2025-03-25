import { useCustomUnityContext } from "contexts/CustomUnityContext";
import { useCallback } from "react";
import {
  NotifyRemoveRequestResult,
  WorkspaceLoadData,
  WorkspaceRemoveItemRequestedHandler,
  WorkspaceSaveDataGeneratedHandler,
} from "types/adminTypes";
import {
  AcrylicBaseScaleRatio,
  DebugFlag,
  ItemType,
  ModelParams,
  SampleSaveData,
  TextureParam,
} from "types/unityTypes";
import { DefaultAcrylicBaseScaleRatio } from "../constants";
import {
  MessageBodyForSavingSaidanData,
  NftModelGeneratedHandler,
  SaidanTextureType,
  SaidanType,
  UndoneOrRedoneHandler,
  UnityMessageJson,
  UnitySceneType,
} from "../types";
import { useSaidanLikeUnityHookBase } from "../useSaidanLikeUnityHookBase";
import { useUnityMessageHandler } from "../useUnityMessageHandler";
import { useApplyAcrylicBaseScaleRatio } from "./useApplyAcrylicBaseScaleRatio";
import { useHighlightSamples } from "./useHighlightSamples";

type ItemThumbnailGeneratedHandler = (thumbnailBase64: string) => void;

export const useWorkspaceUnityHook = ({
  sampleMenuX = -1,
  rollbackDialogRef,
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
  rollbackDialogRef: React.RefObject<HTMLDialogElement>;
  onSaveDataGenerated?: WorkspaceSaveDataGeneratedHandler;
  onItemThumbnailGenerated?: ItemThumbnailGeneratedHandler;
  onRemoveSampleEnabled?: () => void;
  onRemoveSampleDisabled?: () => void;
  onRemoveSampleRequested?: WorkspaceRemoveItemRequestedHandler;
  onActionUndone?: UndoneOrRedoneHandler;
  onActionRedone?: UndoneOrRedoneHandler;
  onNftModelGenerated?: NftModelGeneratedHandler;
}) => {
  const sceneType = UnitySceneType.Workspace;
  const {
    // states
    isSceneOpen,
    isItemsLoaded,
    isDragging,
    selectedItem,
    isUndoable,
    isRedoable,
    // functions
    postMessageToUnity,
    setLoadData: privateSetLoadData,
    requestSaveData,
    placeNewSample,
    placeNewSampleWithDrag,
    removeItem,
    notifyAddRequestResult,
    setIsUndoable,
    setIsRedoable,
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
    handleCheckConnection,
  } = useSaidanLikeUnityHookBase({
    sceneType,
    itemMenuX: sampleMenuX,
    rollbackDialogRef,
    onRemoveItemEnabled: onRemoveSampleEnabled,
    onRemoveItemDisabled: onRemoveSampleDisabled,
    onActionUndone,
    onActionRedone,
    onNftModelGenerated,
  });

  const {
    addEventListener: unityAddEventListener,
    removeEventListener: unityRemoveEventListener,
  } = useCustomUnityContext();

  // functions
  const processLoadData = useCallback((loadData: WorkspaceLoadData) => {
    console.log(loadData);
    if (loadData == null) return null;

    var saidanItemList = loadData.workspaceItemList.map((v) => {
      return {
        ...v,
        itemType: ItemType.Sample,
        imageUrl: v.croppedUrl ?? v.materialUrl ?? "",
        shelfSectionIndex: -1,
        acrylicBaseScaleRatio:
          v.acrylicBaseScaleRatio ?? DefaultAcrylicBaseScaleRatio,
        itemName: v.name,
      };
    });

    return {
      saidanId: -2,
      saidanType: SaidanType.Workspace,
      saidanUrl: "",
      saidanTextureType: SaidanTextureType.White,
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
    (itemIdList: number[], shouldClearActionHistory: boolean = true) => {
      const list = itemIdList.map((itemId) => ({
        itemType: ItemType.Sample,
        itemId,
      }));
      postMessageToUnity(
        "RemoveItemsMessageReceiver",
        JSON.stringify({ itemRefList: list, shouldClearActionHistory }),
      );
      setIsUndoable(false);
      setIsRedoable(false);
    },
    [postMessageToUnity],
  );

  const notifyRemoveRequestResult: NotifyRemoveRequestResult = useCallback(
    (isSuccess, itemType, id, apiRequestId) => {
      if (!isSuccess) {
        rollbackDialogRef.current?.showModal();
      }
      postMessageToUnity(
        "NotifyRemoveRequestResultMessageReceiver",
        JSON.stringify({
          isSuccess,
          itemType,
          id,
          apiRequestId,
        }),
      );
    },
    [postMessageToUnity],
  );

  const requestItemThumbnail = useCallback(
    (
      params: ModelParams & TextureParam & AcrylicBaseScaleRatio & DebugFlag,
    ) => {
      postMessageToUnity(
        "ItemThumbnailGenerationMessageReceiver",
        JSON.stringify({
          ...params,
        }),
      );
    },
    [postMessageToUnity],
  );

  const { highlightSamplesByItemId } = useHighlightSamples({
    postMessageToUnity,
  });

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
      onSaveDataGenerated(
        { workspaceItemList },
        messageBody.newItemInfo,
        notifyAddRequestResult,
      );
    },
    [onSaveDataGenerated, notifyAddRequestResult],
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
        itemId: number;
        id: number;
        apiRequestId: number;
      };

      if (!messageBody) return;

      onRemoveSampleRequested(
        messageBody.id,
        messageBody.apiRequestId,
        notifyRemoveRequestResult,
      );
    },
    [onRemoveSampleRequested, notifyRemoveRequestResult],
  );

  const { applyAcrylicBaseScaleRatio } = useApplyAcrylicBaseScaleRatio({
    postMessageToUnity,
  });

  useUnityMessageHandler({
    sceneType,
    unityAddEventListener,
    unityRemoveEventListener,
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
    handleCheckConnection,
  });

  return {
    // states
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
    highlightSamplesByItemId,
    requestItemThumbnail,
    undoAction,
    redoAction,
    deleteAllActionHistory,
    pauseUnityInputs,
    resumeUnityInputs,
    applyAcrylicBaseScaleRatio,
    requestNftModelGeneration,
    handleMouseUp,
  };
};
