import { ProviderId as FirebaseProviderId } from "firebase/auth";
import {
  ItemType,
  NftLoadData,
  NftSaveData,
  SampleSaveData,
  ShowcaseSampleLoadData,
  ShowcaseSettings,
  ShowcaseType,
  WorkspaceSampleLoadData,
} from "./unityTypes";

export type User = {
  uuid: string;
  name: string;
  email: string;
  icon: string;
  emailVerified: boolean;
  hasFlowAccount: boolean;
  hasBusinessAccount: HasBusinessAccount;
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
  copyrightHolder: string[];
  file1?: File | string;
  file2?: File | string;
  file3?: File | string;
  file4?: File | string;
  license: {
    com: Boolean;
    adp: Boolean;
    der: Boolean;
    mer: Boolean;
    dst: Boolean;
    ncr: Boolean;
  };
};

export type TcpFormType = {
  content: TcpContent;
  user: TcpUser;
  copyright: TcpCopyright;
};

export type WorkspaceLoadData = {
  workspaceItemList: WorkspaceSampleLoadData[];
  isDebug?: boolean;
};

export type WorkspaceSaveData = {
  workspaceItemList: SampleSaveData[];
};

export type ShowcaseLoadData = {
  showcaseId: number;
  showcaseType: ShowcaseType;
  showcaseUrl: string;
  sampleItemList: ShowcaseSampleLoadData[];
  nftItemList: NftLoadData[];
  settings: ShowcaseSettings;
  isDebug?: boolean;
};

export type ShowcaseSaveData = {
  sampleItemList: SampleSaveData[];
  nftItemList: NftSaveData[];
  thumbnailImageBase64: string;
  settings: ShowcaseSettings;
};

export type IdPairs = {
  previous: number;
  next: number;
}[];

export type UpdateIdValues = ({ idPairs }: { idPairs: IdPairs }) => void;

export type SendSampleRemovalResult = (id: number, completed: boolean) => void;
export type SendItemRemovalResult = (
  itemType: ItemType,
  id: number,
  completed: boolean,
) => void;

export type WasdParams = {
  wKey: boolean;
  aKey: boolean;
  sKey: boolean;
  dKey: boolean;
};

export type HasBusinessAccount =
  | "exist"
  | "not-exist"
  | "reported"
  | "freezed"
  | "not-approved"
  | "rejected";

export const EMAIL_REGEX = /^[\w\-._+]+@[\w\-._]+\.[A-Za-z]+/;
export const ProviderId = {
  GOOGLE: FirebaseProviderId.GOOGLE,
  APPLE: "apple.com",
  PASSWORD: FirebaseProviderId.PASSWORD,
} as const;

export type ProviderId = (typeof ProviderId)[keyof typeof ProviderId];
export const isProviderId = (arg: string): arg is ProviderId =>
  Object.values(ProviderId).includes(arg as ProviderId);
