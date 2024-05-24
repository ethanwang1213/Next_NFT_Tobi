import { ShowcaseItemData, WorkspaceItemData } from "./unityTypes";

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

export type WorkspaceLoadData = {
  workspaceItemList: WorkspaceItemData[];
};

export type WorkspaceSaveData = {
  workspaceItemList: WorkspaceItemData[];
};

export type ShowcaseLoadData = {
  showcaseId: number;
  showcaseType: number;
  showcaseUrl: string;
  sampleItemList: ShowcaseItemData[];
  nftItemList: ShowcaseItemData[];
};

export type ShowcaseSaveData = {
  sampleItemList: ShowcaseItemData[];
  nftItemList: ShowcaseItemData[];
  thumbnailImageBase64: string;
};
