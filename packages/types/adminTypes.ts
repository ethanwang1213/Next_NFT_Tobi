export type User = {
  uuid: string;
  name: string;
  email: string;
  emailVerified: boolean;
  hasFlowAccount: boolean;
  hasBusinessAccount: boolean;
};

export enum FILTER_TYPE {
  CHECKBOX,
  RADIO,
}

export interface FILTER {
  type: FILTER_TYPE;
  label: string;
  children?: Array<FILTER>;
}

export type ErrorMessage = {
  code: string;
  message: string;
};

export type ApiProfileData = {
  userId: string;
  username: string;
  email: string;
  icon: string;
  sns: string;
  aboutMe: string;
  socialLinks: string[];
  gender: string;
  birth: string;
  flow: {
    flowAddress: string;
    publicKey: string;
    txId: string;
  };
  createdAt: string;
};

export type TcpContent = {
  name: string;
  url: string;
  description: string;
};

export type TcpUser = {
  firstName: string;
  lastName: string;
  birthdayYear: number;
  birthdayMonth: number;
  birthdayDate: number;
  email: string;
  phone: string;
  building: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
};

export type TcpCopyright = {
  copyrightHolder: string;
  license: string;
  file1?: File;
  file2?: File;
  file3?: File;
  file4?: File;
};

export type TcpFormType = {
  content: TcpContent;
  user: TcpUser;
  copyright: TcpCopyright;
};

// Unity data types
export const ItemType = {
  Sample: 0,
  DigitalItemNft: 1,
} as const;
export type ItemType = (typeof ItemType)[keyof typeof ItemType];

export const ModelType = {
  Poster: 1,
  AcrylicStand: 2,
} as const;
export type ModelType = (typeof ModelType)[keyof typeof ModelType];

export const UnityStageType = {
  Floor: 0,
  BackWall: 1,
  LeftWall: 2,
  RightWall: 3,
} as const;
export type UnityStageType =
  (typeof UnityStageType)[keyof typeof UnityStageType];

type Vector3 = {
  x: number;
  y: number;
  z: number;
};

export type SaidanItemData = {
  itemType: ItemType;
  itemId: number;
  modelType: ModelType;
  modelUrl: string;
  imageUrl: string;
  stageType: UnityStageType;
  position: Vector3;
  rotation: Vector3;
  scale: number;
};

export type WorkspaceItemData = Omit<SaidanItemData, "itemType">;

export type WorkspaceSaveData = {
  workspaceItemList: WorkspaceItemData[];
};

export type ShowcaseItemData = Omit<SaidanItemData, "itemType">;

export type ShowcaseSaveDataFromUnity = {
  sampleItemList: ShowcaseItemData[];
  nftItemList: ShowcaseItemData[];
  thumbnailImageBase64: string;
};
// End of Unity data types
