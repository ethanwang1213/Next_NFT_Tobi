import { useEffect, useMemo } from "react";
import {
  ItemType,
  ModelType,
  SaidanLikeData,
  SaidanType,
  UnityStageType,
} from "types/adminTypes";

export const useInternalWorkspaceContext = ({ loadData }) => {
  const processedLoadData = useMemo(() => {
    console.log(loadData);
    if (loadData == null) return null;

    if (loadData === "hoge") {
      return dummyLoadData[0];
    } else if (loadData === "fuga") {
      return dummyLoadData[1];
    } else {
      return null;
    }
  }, [loadData]);
  return { processedLoadData };
};

export const useInternalShowcaseEditContext = ({ loadData }) => {
  const processedLoadData = useMemo(() => {
    console.log(loadData);
    if (loadData == null) return null;

    if (loadData === "hoge") {
      return dummyLoadData[0];
    } else if (loadData === "fuga") {
      return dummyLoadData[1];
    } else {
      return null;
    }
  }, [loadData]);
  return { processedLoadData };
};

export const useInternalUnityContext = ({
  loadData,
  postMessageToLoadData,
}: {
  loadData: SaidanLikeData;
  postMessageToLoadData: (loadData: SaidanLikeData) => void;
}) => {
  useEffect(() => {
    if (!loadData) return;
    postMessageToLoadData(loadData);
  }, [loadData, postMessageToLoadData]);

  return;
};

const dummyLoadData: SaidanLikeData[] = [
  {
    saidanId: 0,
    saidanType: SaidanType.ShowcaseFirst,
    saidanUrl: "",
    saidanItemList: [
      {
        itemType: ItemType.Sample,
        itemId: 0,
        modelType: ModelType.Poster,
        modelUrl: "",
        imageUrl: "",
        stageType: UnityStageType.Floor,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 1.5,
      },
    ],
  },
  {
    saidanId: 1,
    saidanType: SaidanType.ShowcaseSecond,
    saidanUrl: "",
    saidanItemList: [
      {
        itemType: ItemType.DigitalItemNft,
        itemId: 99,
        modelType: ModelType.AcrylicStand,
        modelUrl: "",
        imageUrl: "",
        stageType: UnityStageType.BackWall,
        position: { x: 1, y: 0, z: 1 },
        rotation: { x: 1, y: 0, z: 0 },
        scale: 2.0,
      },
      {
        itemType: ItemType.Sample,
        itemId: 88,
        modelType: ModelType.Poster,
        modelUrl: "",
        imageUrl: "",
        stageType: UnityStageType.LeftWall,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 1.7,
      },
    ],
  },
];
