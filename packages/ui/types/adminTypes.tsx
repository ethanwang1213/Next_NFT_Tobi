export type MaterialItem = {
  id: number;
  image: string;
};

export type SampleItem = {
  sampleItemId: number;
  digitalItemId: number;
  name: string;
  thumbUrl: string;
  modelUrl: string;
  croppedUrl?: string;
  materialId: number;
  type: number;
  acrylicBaseScaleRatio: number;
};

export type NftItem = {
  id: number;
  digitalItemId: number;
  name: string;
  image: string;
  modelUrl: string;
  modelType: number;
  saidanId: number;
  materialImage: string;
};

export enum DigitalItemStatus {
  None = 0,
  Draft = 1,
  Private,
  ViewingOnly,
  OnSale,
  Unlisted,
  DigitalItemStatusCount,
}

export const getDigitalItemStatusTitle = (
  status: DigitalItemStatus,
  t: (key: string) => string,
) => {
  switch (status) {
    case DigitalItemStatus.Draft:
      return t("Draft");
    case DigitalItemStatus.Private:
      return t("Private");
    case DigitalItemStatus.ViewingOnly:
      return t("ViewingOnly");
    case DigitalItemStatus.OnSale:
      return t("OnSale");
    case DigitalItemStatus.Unlisted:
      return t("Unlisted");
    default:
      return "";
  }
};

export type ScheduleItem = {
  status: DigitalItemStatus;
  datetime: string;
};
