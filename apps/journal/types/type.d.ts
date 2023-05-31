import { ReactElement } from "react";
import { Timestamp } from "@firebase/firestore";

export type tagType = {
  page: number | (() => void);
  image: string | ReactElement;
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
  profilePageNo: number;
  nekoPageNo: number;
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

type Community = {
  joined: boolean;
  house?: {
    role_id: string;
    type: string;
    name: string;
  };
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
  community?: Community;
};

export type NFTData = {
  collectionId: string;
  name: string;
  description?: string;
  thumbnail: string;
  acquisition_time: number;
  acquisition_method?: string;
};

export type HouseBadgeNFTData = NFTData & {
  house_type: string;
};

export type NFTCollection = {
  hold: {
    [tokenId: string]: NFTData;
  };
};

export type HoldingNFTs = {
  [collection: string]: NFTCollection;
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
  updateProfile: (
    newIcon: string,
    newName: string,
    newBirthday: Birthday
  ) => void;
  setJoinTobiratoryAt: (joinDate: Date) => void;
};
