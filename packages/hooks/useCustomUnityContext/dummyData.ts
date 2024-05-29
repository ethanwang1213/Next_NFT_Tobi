import { ItemType, ModelType, UnityStageType } from "types/unityTypes";
import { SaidanLikeData, SaidanType } from "./types";

export const dummyLoadData: SaidanLikeData[] = [
  {
    saidanId: 0,
    saidanType: SaidanType.ShowcaseFirst,
    saidanUrl: "",
    saidanItemList: [
      {
        itemType: ItemType.Sample,
        itemId: 0,
        tableId: 0,
        modelType: ModelType.Poster,
        modelUrl: "",
        imageUrl: "",
        stageType: UnityStageType.Floor,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        canScale: true,
        itemMeterHeight: 0.3,
        scale: 1.5,
        isDebug: true,
      },
    ],
    saidanCameraData: {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    isDebug: true,
  },
  {
    saidanId: 1,
    saidanType: SaidanType.ShowcaseSecond,
    saidanUrl: "",
    saidanItemList: [
      {
        itemType: ItemType.DigitalItemNft,
        itemId: 99,
        tableId: 200,
        modelType: ModelType.AcrylicStand,
        modelUrl: "",
        imageUrl: "",
        stageType: UnityStageType.BackWall,
        position: { x: 1, y: 0, z: 1 },
        rotation: { x: 1, y: 0, z: 0 },
        canScale: true,
        itemMeterHeight: 0.3,
        scale: 2.0,
        isDebug: true,
      },
      {
        itemType: ItemType.Sample,
        itemId: 88,
        tableId: 102,
        modelType: ModelType.Poster,
        modelUrl: "",
        imageUrl: "",
        stageType: UnityStageType.LeftWall,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        canScale: true,
        itemMeterHeight: 0.3,
        scale: 1.7,
        isDebug: true,
      },
    ],
    saidanCameraData: {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    isDebug: true,
  },
];
