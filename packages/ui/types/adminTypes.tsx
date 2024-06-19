export type MaterialItem = {
  id: number;
  image: string;
};

export type SampleItem = {
  id: number;
  name: string;
  thumbUrl: string;
  modelUrl: string;
  materialId: number;
  type: number;
};

export type NftItem = {
  id: number;
  name: string;
  image: string;
  modelUrl: string;
  modelType: number;
  saidanId: number;
  materialImage: string;
};
