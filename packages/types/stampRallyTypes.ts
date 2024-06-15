// mint状態のタイプ
export type MintStatusType = "NOTHING" | "IN_PROGRESS" | "DONE";

export type CompleteStampType = "Complete";

export type StampRallyEvents =
  | "TOBIRAPOLISFESTIVAL2023"
  | "TOBIRAPOLISMUSICFESTIVAL2024";

// mint状態データ変更メソッド用（全てoptionalじゃなく設定）
export type MintStatusForSetMethod = {
  TOBIRAPOLISFESTIVAL2023: Tpf2023StampRallyData;
  TOBIRAPOLISMUSICFESTIVAL2024: Tmf2024StampRallyData;
};

// mint状態データ
// 今後も使いそうなデータなので、追加できる形にしました
export type MintStatus = {
  [key in StampRallyEvents]?: MintStatusForSetMethod[key];
};

// スタンプラリーの記念品受け取り用フォームのデータ型
export type StampRallyRewardFormType = {
  event: StampRallyEvents;
  keyword: string;
};

export type StampRallyResultType<T extends string> = {
  stamp: T;
  status: "IN_PROGRESS";
  isComplete: boolean;
};

export type StampRallyData<T extends string> = {
  [key in T]?: MintStatusType;
};

////////////////////////////////////
/// TOBIRAPOLIS祭2023スタンプラリー ///
////////////////////////////////////

// TOBIRAPOLIS祭2023スタンプラリーのスタンプタイプ
export type Tpf2023StampType =
  | "G0"
  | "G1alpha"
  | "G1beta"
  | "G1gamma"
  | "G1delta";

// TOBIRAPOLIS祭2023スタンプラリーのmint状態データ
export type Tpf2023StampRallyData = StampRallyData<
  Tpf2023StampType | CompleteStampType
>;

//////////////////////////////////////////////////
/// TOBIRAPOLIS MUSIC FESTIVAL2024スタンプラリー ///
//////////////////////////////////////////////////

// TOBIRAPOLIS MUSIC FESTIVAL 2024のスタンプタイプ
export type Tmf2024StampType = "Stamp";

// TOBIRAPOLIS MUSIC FESTIVAL 2024のmint状態データ
export type Tmf2024StampRallyData = StampRallyData<Tmf2024StampType>;
