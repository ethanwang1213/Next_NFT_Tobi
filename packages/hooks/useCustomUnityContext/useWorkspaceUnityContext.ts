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

type MessageBodyForGeneratingItemThumbnail = {
  base64Image: string;
};

type Props = {
  onSaveDataGenerated?: (workspaceSaveData: WorkspaceSaveData) => void;
  onItemThumbnailGenerated?: (thumbnailBase64: string) => void;
};

export const useWorkspaceUnityContext = ({
  onSaveDataGenerated,
  onItemThumbnailGenerated,
}: Props) => {
  const {
    unityProvider,
    addEventListener,
    removeEventListener,
    postMessageToUnity,
    setLoadData: privateSetLoadData,
    requestSaveData,
    placeNewItem,
    removeItem: internalRemoveItem,
    handleSimpleMessage,
    handleSceneIsLoaded,
  } = useSaidanLikeUnityContextBase({
    sceneType: UnitySceneType.Workspace,
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

  const removeSample = useCallback(
    ({ itemId, tableId }: { itemId: number; tableId: number }) => {
      internalRemoveItem({
        itemType: ItemType.Sample,
        itemId,
        tableId,
      });
    },
    [internalRemoveItem],
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

      const messageBody = JSON.parse(
        msgObj.messageBody,
      ) as MessageBodyForGeneratingItemThumbnail;

      if (!messageBody) return;

      onItemThumbnailGenerated(messageBody.base64Image);
    },
    [onItemThumbnailGenerated],
  );

  useUnityMessageHandler({
    addEventListener,
    removeEventListener,
    handleSimpleMessage,
    handleSceneIsLoaded,
    handleSaveDataGenerated,
    handleItemThumbnailGenerated,
  });

  return {
    unityProvider,
    setLoadData,
    requestSaveData,
    placeNewSample,
    removeSample,
    removeSamplesByItemId,
    requestItemThumbnail,
  };
};
