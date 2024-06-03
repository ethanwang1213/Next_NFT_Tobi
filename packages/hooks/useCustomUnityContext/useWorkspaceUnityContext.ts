import { useCallback } from "react";
import { WorkspaceLoadData, WorkspaceSaveData } from "types/adminTypes";
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
  sampleMenuX: number;
  onSaveDataGenerated?: (workspaceSaveData: WorkspaceSaveData) => void;
  onItemThumbnailGenerated?: (thumbnailBase64: string) => void;
  onRemoveSampleEnabled?: () => void;
  onRemoveSampleDisabled?: () => void;
  onRemoveSampleRequested?: (itemId: number, tableId: number) => void;
};

export const useWorkspaceUnityContext = ({
  sampleMenuX,
  onSaveDataGenerated,
  onItemThumbnailGenerated,
  onRemoveSampleEnabled,
  onRemoveSampleDisabled,
  onRemoveSampleRequested,
}: Props) => {
  const {
    unityProvider,
    isDragging,
    addEventListener,
    removeEventListener,
    postMessageToUnity,
    setLoadData: privateSetLoadData,
    requestSaveData,
    placeNewItem,
    placeNewItemWithDrag,
    removeItem,
    handleSimpleMessage,
    handleSceneIsLoaded,
    handleDragStarted,
    handleDragEnded,
    handleRemoveItemEnabled,
    handleRemoveItemDisabled,
  } = useSaidanLikeUnityContextBase({
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
      privateSetLoadData(processLoadData(loadData));
    },
    [privateSetLoadData, processLoadData],
  );

  const placeNewSample = useCallback(
    (params: Omit<ItemBaseData, "itemType">) => {
      placeNewItem({
        itemType: ItemType.Sample,
        ...params,
      });
    },
    [placeNewItem],
  );

  const placeNewSampleWithDrag = useCallback(
    (itemData: Omit<ItemBaseData, "itemType">) => {
      placeNewItemWithDrag({
        itemType: ItemType.Sample,
        ...itemData,
      });
    },
    [placeNewItemWithDrag],
  );

  const removeSample = useCallback(
    ({ itemId, tableId }: { itemId: number; tableId: number }) => {
      removeItem({
        itemType: ItemType.Sample,
        itemId,
        tableId,
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

  const requestItemThumbnail = useCallback(
    (params: ItemThumbnailParams) => {
      postMessageToUnity(
        "ItemThumbnailGenerationMessageReceiver",
        JSON.stringify({
          ...params,
        }),
      );
    },
    [postMessageToUnity],
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
          itemId: v.itemId,
          tableId: v.tableId,
          stageType: v.stageType,
          position: v.position,
          rotation: v.rotation,
          scale: v.scale,
        }));
      onSaveDataGenerated({ workspaceItemList });
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
        itemId: number;
        tableId: number;
      };

      if (!messageBody) return;

      onRemoveSampleRequested(messageBody.itemId, messageBody.tableId);
    },
    [onRemoveSampleRequested],
  );

  useUnityMessageHandler({
    addEventListener,
    removeEventListener,
    handleSimpleMessage,
    handleSceneIsLoaded,
    handleSaveDataGenerated,
    handleItemThumbnailGenerated,
    handleDragStarted,
    handleDragEnded,
    handleRemoveItemEnabled,
    handleRemoveItemDisabled,
    handleRemoveItemRequested: handleRemoveSampleRequested,
  });

  return {
    unityProvider,
    isDragging,
    setLoadData,
    requestSaveData,
    placeNewSample,
    placeNewSampleWithDrag,
    removeSample,
    removeSamplesByItemId,
    requestItemThumbnail,
  };
};
