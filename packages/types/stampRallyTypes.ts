// mint状態のタイプ
export type MintStatusType = "NOTHING" | "IN_PROGRESS" | "DONE";

export type CompleteStampType = "Complete";

export type FormStatus = "Nothing" | "Checking" | "Minting" | "Incorrect" | "Success";

export type StampRallyEvents =
  | "TOBIRAPOLISFESTIVAL2023"
  | "TOBIRAMUSICFESTIVAL2024"
  | "TOBIRAPOLISFIREWORKS2024";

// mint状態データ変更メソッド用（全てoptionalじゃなく設定）
export type MintStatusForSetMethod = {
  TOBIRAPOLISFESTIVAL2023: Tpf2023StampRallyData;
  TOBIRAMUSICFESTIVAL2024: Tmf2024StampRallyData;
  TOBIRAPOLISFIREWORKS2024: Tpfw2024StampRallyData;
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

export type StampRallyEventType = "tpf2023" | "tmf2024" | "tpfw2024";

////////////////////////////////////
/// TOBIRAPOLIS祭2023スタンプラリー ///
////////////////////////////////////

// TOBIRAPOLIS祭2023スタンプラリーのスタンプタイプ
export type Tpf2023StampType = "G0" | "G1alpha" | "G1beta" | "G1gamma" | "G1delta";

// TOBIRAPOLIS祭2023スタンプラリーのmint状態データ
export type Tpf2023StampRallyData = StampRallyData<Tpf2023StampType | CompleteStampType>;

//////////////////////////////////////////////////
/// TOBIRAPOLIS MUSIC FESTIVAL2024スタンプラリー ///
//////////////////////////////////////////////////

// TOBIRAPOLIS MUSIC FESTIVAL 2024のスタンプタイプ
export type Tmf2024StampType = "TobiraMusicFestival2024" | "YouSoTotallyRock";

// TOBIRAPOLIS MUSIC FESTIVAL 2024のmint状態データ
export type Tmf2024StampRallyData = StampRallyData<Tmf2024StampType>;

// TOBIRAPOLIS MUSIC FESTIVAL 2024のNFT Metadata
export const Tmf2024StampMetadata: {
  [key in Tmf2024StampType]: { name: string; description: string };
} = {
  TobiraMusicFestival2024: {
    name: "TOBIRA MUSIC FESTIVAL 2024",
    description: "",
  },
  YouSoTotallyRock: {
    name: "You so totally rock!",
    description: "",
  },
};

/////////////////////////////////////////////
/// TOBIRAPOLIS花火大会2024スタンプラリー ///
/////////////////////////////////////////////

// TOBIRAPOLIS花火大会2024のスタンプタイプ
export type Tpfw2024StampType = "TobirapolisFireworks2024";

export type Tpfw2024StampRallyData = StampRallyData<Tpfw2024StampType>;

// TOBIRAPOLIS花火大会2024のNFT Metadata
export const Tpfw2024StampMetadata: {
  [key in Tpfw2024StampType]: { name: string; description: string };
} = {
  TobirapolisFireworks2024: {
    name: "TOBIRAPOLIS FIREWORKS 2024",
    description: "",
  },
};
