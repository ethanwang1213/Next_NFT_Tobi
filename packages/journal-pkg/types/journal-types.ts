// journal分離用

import { Timestamp } from "firebase/firestore/lite";
import { ReactElement } from "react";

// journal 本のタグのデータ型
export type tagType = {
  page: number | (() => void);
  image: string | ReactElement;
};

// journal ページのインデックスのデータ型
export type PageIndexData = {
  start: number;
  end: number;
};

// journal ページのインデックスをまとめたデータ型
export type BookIndex = {
  profilePage: PageIndexData;
  nekoPage: PageIndexData;
  nftPage: PageIndexData;
  redeemPage: PageIndexData;
};

// journal 本の画像の左上隅座標を表す型
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

// ユーザーの所属Houseの型
export type HouseData = {
  joined: boolean;
  role_id?: string;
  type?: string;
  name?: string;
};

// mint状態のタイプ
export type MintStatusType = "NOTHING" | "IN_PROGRESS" | "DONE";

// TOBIRAPOLIS祭2023スタンプラリーのスタンプタイプ
export type Tpf2023StampType =
  | "G0"
  | "G1alpha"
  | "G1beta"
  | "G1gamma"
  | "G1delta";

export type Tpf2023Complete = "Complete";

// TOBIRAPOLIS祭2023スタンプラリーのmint状態データ
export type Tpf2023StampRallyData = {
  [key in Tpf2023StampType | Tpf2023Complete]?: MintStatusType;
};

// mint状態データ
// 今後も使いそうなデータなので、追加できる形にしました
export type MintStatus = {
  TOBIRAPOLISFESTIVAL2023?: Tpf2023StampRallyData;
};

// mint状態データ変更メソッド用（全てoptionalじゃなく設定）
export type MintStatusForSetMethod = {
  TOBIRAPOLISFESTIVAL2023: Tpf2023StampRallyData;
};

// ユーザーデータの型
export type User = {
  id: string;
  name: string;
  email: string;
  discord?: string;
  icon: string;
  createdAt: number;
  birthday: Birthday;
  characteristic?: Characteristic;
  mintStatus?: MintStatus;
};

// NFTの基本データ型
export type NftData = {
  collectionId: string;
  name: string;
  description?: string;
  thumbnail: string;
  acquisition_time: Timestamp;
  acquisition_method?: string;
};

// HouseBadgeNFTの追加データ型
export type HouseBadgeNftData = NftData & {
  house_type: string;
};

// 保有するNFTのコレクションのデータ型
export type NftCollection = {
  hold: {
    [tokenId: string]: NftData;
  };
};

// 保有するNFTのコレクションをまとめたデータ型
export type HoldingNfts = {
  [collection: string]: NftCollection;
};

// DBActivityRecordと対になる
// ローカルのActivityRecordのデータ型
export type LocalActivityRecord = {
  text: string;
  date: Date; // firestoreのTimestamp型をDate型に変換したもの
};

// LocalActivityRecordと対になる
// DBのActivityRecordのデータ型
export type DBActivityRecord = {
  text: string;
  timestamp: Timestamp;
};

export type RedeemStatus =
  | "NONE"
  | "CHECKING"
  | "SUCCESS"
  | "INCORRECT"
  | "SERVER_ERROR";

// スタンプラリーの記念品受け取り用フォームのデータ型
export type StampRallyRewardFormType = {
  keyword: string;
};

export type StampRallyResultType = {
  stamp: Tpf2023StampType;
  status: "IN_PROGRESS";
  isComplete: boolean;
};

export type ErrorMessage = {
  code: string;
  message: string;
};