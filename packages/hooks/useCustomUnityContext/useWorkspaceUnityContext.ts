import { useCallback } from "react";
import {
  ItemBaseData,
  ItemType,
  WorkspaceItemData,
  WorkspaceSaveData,
} from "types/adminTypes";
import { dummyLoadData } from "./dummyData";
import {
  MessageBodyForSavingSaidanData,
  UnityMessageJson,
  UnitySceneType,
} from "./unityType";
import { useSaidanLikeUnityContextBase } from "./useSaidanLikeUnityContextBase";
import { useUnityMessageHandler } from "./useUnityMessageHandler";

type ItemThumbnailParams = Omit<ItemBaseData, "itemType" | "itemId">;

type MessageBodyForGeneratingItemThumbnail = {
  thumbnailBase64: string;
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

  const processLoadData = useCallback((loadData: any) => {
    console.log(loadData);
    if (loadData == null) return null;

    // TODO(toruto): implement to process loadData
    // return dummy data
    if (loadData === 0) {
      return dummyLoadData[0];
    } else if (loadData === 1 || loadData === 2) {
      return dummyLoadData[1];
    } else {
      return null;
    }
  }, []);

  const setLoadData = useCallback(
    (loadData: any) => {
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
        "RemoveItemsByIdMessageReceiver",
        JSON.stringify({ list }),
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

      var workspaceItemList =
        messageBody.saidanData.saidanItemList.map<WorkspaceItemData>((v) => {
          delete v.itemType;
          return v;
        });
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

      onItemThumbnailGenerated(messageBody.thumbnailBase64);
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
