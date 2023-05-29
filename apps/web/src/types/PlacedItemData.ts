import { Vector3 } from "three";
import { ItemType } from "./ItemType";
import { MovePointerTargetName } from "./PointerTargetName";

export type CropData = {
  isSet: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  srcW: number;
  srcH: number;
};

export type CropperParams = {
  crop: {
    x: number,
    y: number;
  };
  zoom: number;
}

type OmitItemType = "TIN_BADGE" | "POSTER";
export type SrcItemData = {
  id: string;
  isSample: boolean;
  imageSrc: string;
  squareImageSrc: string;
  whitedImageSrc: string;
  acstModelSrc: string;
  isAcstAlreadyRequested: boolean;
  // 次回に同じクロップを繰り返しやすいように、クロップ設定を保存する
  pCropperParams: {
    [itemType in OmitItemType]: CropperParams; // eslint-disable-line no-unused-vars
  };
};

export type PlacedItemData = {
  id: string;
  srcId: string;
  itemType: ItemType;
  position: Vector3;
  rotation: number;
  scale: number;
  place: MovePointerTargetName;
  isInLimitedPlace: boolean;
  cropData?: CropData;
};

export type DBItemData = Omit<PlacedItemData, "id" | "rotation" | "isInLimitedPlace">

export type ItemSizeData = {
  [placedId: string]: Vector3;
};
