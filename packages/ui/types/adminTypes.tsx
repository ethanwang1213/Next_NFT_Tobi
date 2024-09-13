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
  materialId: number;
  type: number;
};

export type NftItem = {
  sampleItemId: number;
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

export const getDigitalItemStatusTitle = (status) => {
  let value;
  switch (status) {
    case DigitalItemStatus.Draft:
      value = "Draft";
      break;
    case DigitalItemStatus.Private:
      value = "Private";
      break;
    case DigitalItemStatus.ViewingOnly:
      value = "Viewing Only";
      break;
    case DigitalItemStatus.OnSale:
      value = "On Sale";
      break;
    case DigitalItemStatus.Unlisted:
      value = "Unlisted";
      break;
    default:
      value = "";
      break;
  }
  return value;
};

export type ScheduleItem = {
  status: DigitalItemStatus;
  datetime: string;
};
