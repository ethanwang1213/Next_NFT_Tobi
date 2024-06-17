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

export type Vector2 = {
  x: number;
  y: number;
};
