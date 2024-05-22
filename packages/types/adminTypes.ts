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
const SaidanType = {
  Workspace: 0,
  SaidanFirst: 1,
  SaidanSecond: 2,
  SaidanThird: 3,
  ShowcaseFirst: 4,
  ShowcaseSecond: 5,
  ShowcaseThird: 6,
} as const;
type SaidanType = (typeof SaidanType)[keyof typeof SaidanType];

const ItemType = {
  Sample: 0,
  DigitalItemNft: 1,
} as const;
type ItemType = (typeof ItemType)[keyof typeof ItemType];

const ModelType = {
  Poster: 1,
  AcrylicStand: 2,
} as const;
type ModelType = (typeof ModelType)[keyof typeof ModelType];

const UnityStageType = {
  Floor: 0,
  BackWall: 1,
  LeftWall: 2,
  RightWall: 3,
} as const;
type UnityStageType = (typeof UnityStageType)[keyof typeof UnityStageType];

type Vector3 = {
  x: number;
  y: number;
  z: number;
};

type SaidanItemData = {
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

export type SaidanLikeData = {
  saidanId: string;
  saidanType: SaidanType;
  saidanUrl: string;
  saidanItemList: Array<SaidanItemData>;
};
// End of Unity data types