import { MetaMaskInpageProvider } from "@metamask/providers";
import { Dispatch, ReactElement } from "react";
import { Timestamp } from "firebase/firestore/lite";
import { StampRallyRewardFormType, StampRallyMintStatusType } from "types";

export declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

export type tagType = {
  page: number | (() => void);
  image: string | ReactElement;
};

export type PageIndexData = {
  start: number;
  end: number;
};

export type BookIndex = {
  profilePage: PageIndexData;
  nekoPage: PageIndexData;
  nftPage: PageIndexData;
  redeemPage: PageIndexData;
};

export type bookContext = {
  pageNo: {
    current: number;
    set: Dispatch<SetStateAction<number>>;
  };
  pages: {
    current: ReactNode[];
    set: Dispatch<SetStateAction<ReactNode[]>>;
  };
  tags: {
    current: tagType[];
    set: Dispatch<SetStateAction<tagType[]>>;
  };
  isMute: {
    current: boolean;
    set: Dispatch<SetStateAction<boolean>>;
  };
  bookIndex: BookIndex;
};

// 本の画像の左上隅座標を表す型
export type BookPos = {
  left: number;
  top: number;
  width: number;
  height: number;
  center: number;
};

// ユーザープロフィールの誕生日の型
export type Birthday = {
  year: number;
  month: number;
  day: number;
};

// ユーザーの特徴情報の型
export type Characteristic = {
  join_tobiratory_at?: Timestamp;
};

type HouseData = {
  joined: boolean;
  role_id?: string;
  type?: string;
  name?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  discord?: string;
  icon: string;
  createdAt: number;
  birthday: Birthday;
  characteristic?: Characteristic;
  stampRallyMintStatus?: StampRallyMintStatusType;
};

export type NftData = {
  collectionId: string;
  name: string;
  description?: string;
  thumbnail: string;
  acquisition_time: Timestamp;
  acquisition_method?: string;
};

export type HouseBadgeNftData = NftData & {
  house_type: string;
};

export type NftCollection = {
  hold: {
    [tokenId: string]: NftData;
  };
};

export type HoldingNfts = {
  [collection: string]: NftCollection;
};

export type LocalActivityRecord = {
  text: string;
  date: Date; // firestoreのTimestamp型をDate型に変換したもの
};

export type DBActivityRecord = {
  text: string;
  timestamp: Timestamp;
};

export type UserContextType = {
  user: User | null | undefined;
  dbIconUrl: string;
  MAX_NAME_LENGTH: number;
  updateProfile: (
    newIcon: string,
    newName: string,
    newBirthday: Birthday,
    newDbIconPath: string
  ) => void;
  setDbIconUrl: Dispatch<SetStateAction<string>>;
  setJoinTobiratoryInfo: (discordId: string, joinDate: Date) => void;
};
