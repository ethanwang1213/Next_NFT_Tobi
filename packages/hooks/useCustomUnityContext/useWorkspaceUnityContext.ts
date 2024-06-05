import { useCallback } from "react";
import {
  UpdateIdValues,
  WorkspaceLoadData,
  WorkspaceSaveData,
} from "types/adminTypes";
import { ItemBaseData, ItemSaveData, ItemType } from "types/unityTypes";
import {
  MessageBodyForSavingSaidanData,
  SaidanType,
  UnityMessageJson,
  UnitySceneType,
} from "./types";
import { useSaidanLikeUnityContextBase } from "./useSaidanLikeUnityContextBase";
import { useUnityMessageHandler } from "./useUnityMessageHandler";

type ItemThumbnailParams = Omit<ItemBaseData, "itemType" | "itemId">;

type Props = {
  sampleMenuX?: number;
  onSaveDataGenerated?: (
    workspaceSaveData: WorkspaceSaveData,
    updateIdValues: UpdateIdValues,
  ) => void;
  onItemThumbnailGenerated?: (thumbnailBase64: string) => void;
  onRemoveSampleEnabled?: () => void;
  onRemoveSampleDisabled?: () => void;
  onRemoveSampleRequested?: (id: number, itemId: number) => void;
};

export const useWorkspaceUnityContext = ({
  sampleMenuX = -1,
  onSaveDataGenerated,
  onItemThumbnailGenerated,
  onRemoveSampleEnabled,
  onRemoveSampleDisabled,
  onRemoveSampleRequested,
}: Props) => {
  const base = useSaidanLikeUnityContextBase({
    sceneType: UnitySceneType.Workspace,
    itemMenuX: sampleMenuX,
    onRemoveItemEnabled: onRemoveSampleEnabled,
    onRemoveItemDisabled: onRemoveSampleDisabled,
  });

  const processLoadData = useCallback((loadData: WorkspaceLoadData) => {
    console.log(loadData);
    if (loadData == null) return null;

    var saidanItemList = loadData.workspaceItemList.map((v) => {
      return {
        ...v,
        itemType: ItemType.Sample,
        canScale: true,
        itemMeterHeight: 0.3,
        isDebug: false, // not used in loading
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
      isDebug: loadData.isDebug ? loadData.isDebug : false,
    };
  }, []);

  const setLoadData = useCallback(
    (loadData: WorkspaceLoadData) => {
      base.setLoadData(processLoadData(loadData));
    },
    [base.setLoadData, processLoadData],
  );

  const removeSample = useCallback(
    ({ id, itemId }: { id: number; itemId: number }) => {
      base.removeItem({
        id: id,
        itemType: ItemType.Sample,
        itemId,
      });
    },
    [base.removeItem],
  );

  const removeSamplesByItemId = useCallback(
    (itemIdList: number[]) => {
      const list = itemIdList.map((itemId) => ({
        itemType: ItemType.Sample,
        itemId,
      }));
      base.postMessageToUnity(
        "RemoveItemsMessageReceiver",
        JSON.stringify({ itemRefList: list }),
      );
    },
    [base.postMessageToUnity],
  );

  const requestItemThumbnail = useCallback(
    (params: ItemThumbnailParams) => {
      base.postMessageToUnity(
        "ItemThumbnailGenerationMessageReceiver",
        JSON.stringify({
          ...params,
        }),
      );
    },
    [base.postMessageToUnity],
  );

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
      onSaveDataGenerated({ workspaceItemList }, base.updateIdValues);
    },
    [onSaveDataGenerated],
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
        id: number;
        itemId: number;
      };

      if (!messageBody) return;

      onRemoveSampleRequested(messageBody.id, messageBody.itemId);
    },
    [onRemoveSampleRequested],
  );

  useUnityMessageHandler({
    addEventListener: base.addEventListener,
    removeEventListener: base.removeEventListener,
    handleSimpleMessage: base.handleSimpleMessage,
    handleSceneIsLoaded: base.handleSceneIsLoaded,
    handleSaveDataGenerated,
    handleItemThumbnailGenerated,
    handleDragStarted: base.handleDragStarted,
    handleDragEnded: base.handleDragEnded,
    handleRemoveItemEnabled: base.handleRemoveItemEnabled,
    handleRemoveItemDisabled: base.handleRemoveItemDisabled,
    handleRemoveItemRequested: handleRemoveSampleRequested,
  });

  return {
    unityProvider: base.unityProvider,
    isDragging: base.isDragging,
    setLoadData,
    requestSaveData: base.requestSaveData,
    placeNewSample: base.placeNewSample,
    placeNewSampleWithDrag: base.placeNewSampleWithDrag,
    removeSample,
    removeSamplesByItemId,
    requestItemThumbnail,
  };
};
