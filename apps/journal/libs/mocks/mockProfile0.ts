import { LocalActivityRecord } from "types/journal-types";

// 以下のtextからランダムに設定
// "TOBIRA NEKO #1をJournalに追加した"
// "TOBIRAPOLISのメンバーになった"
// "TOBIRAPOLISのハウスバッジを入手した"
// dateはDate型でランダムな日付に設定
export const mockRecordList: (LocalActivityRecord & { id: number })[] = [
  {
    id: 0,
    text: "TOBIRA NEKO #1をJournalに追加した",
    date: new Date("2021/06/21"),
  },
  {
    id: 1,
    text: "TOBIRAPOLISのメンバーになった",
    date: new Date("2021/06/21"),
  },
  {
    id: 2,
    text: "TOBIRAPOLISのハウスバッジを入手した",
    date: new Date("2021/06/21"),
  },
  {
    id: 3,
    text: "TOBIRA NEKO #1をJournalに追加した",
    date: new Date("2021/06/21"),
  },
  {
    id: 4,
    text: "TOBIRAPOLISのメンバーになった",
    date: new Date("2021/06/21"),
  },
  {
    id: 5,
    text: "TOBIRAPOLISのハウスバッジを入手した",
    date: new Date("2021/06/22"),
  },
  {
    id: 6,
    text: "TOBIRA NEKO #1をJournalに追加した",
    date: new Date("2021/06/23"),
  },
  {
    id: 7,
    text: "TOBIRAPOLISのメンバーになった",
    date: new Date("2021/06/24"),
  },
  {
    id: 8,
    text: "TOBIRAPOLISのハウスバッジを入手した",
    date: new Date("2021/06/25"),
  },
  {
    id: 9,
    text: "TOBIRA NEKO #1をJournalに追加した",
    date: new Date("2021/06/26"),
  },
  {
    id: 10,
    text: "TOBIRAPOLISのメンバーになった",
    date: new Date("2021/06/27"),
  },
  {
    id: 11,
    text: "TOBIRAPOLISのハウスバッジを入手した",
    date: new Date("2021/06/28"),
  },
  {
    id: 12,
    text: "TOBIRA NEKO #1をJournalに追加した",
    date: new Date("2021/06/29"),
  },
];

export const mockCharacteristicList: { id: number; text: string; value: string }[] = [
  {
    id: 0,
    text: "Participation date of Tobiratory",
    value: "2021/06/21",
  },
  {
    id: 1,
    text: "House Arkhē",
    value: "Hydor",
  },
  {
    id: 2,
    text: "Participation date of Tobiratory",
    value: "2021/06/21",
  },
  {
    id: 3,
    text: "House Arkhē",
    value: "Hydor",
  },
  {
    id: 4,
    text: "Participation date of Tobiratory",
    value: "2021/06/21",
  },
  {
    id: 5,
    text: "House Arkhē",
    value: "Hydor",
  },
  {
    id: 6,
    text: "Participation date of Tobiratory",
    value: "2021/06/21",
  },
  {
    id: 7,
    text: "House Arkhē",
    value: "Hydor",
  },
  {
    id: 8,
    text: "Participation date of Tobiratory",
    value: "2021/06/21",
  },
  {
    id: 9,
    text: "House Arkhē",
    value: "Hydor",
  },
  {
    id: 10,
    text: "Participation date of Tobiratory",
    value: "2021/06/21",
  },
  {
    id: 11,
    text: "House Arkhē",
    value: "Hydor",
  },
  {
    id: 12,
    text: "Participation date of Tobiratory",
    value: "2021/06/21",
  },
  {
    id: 13,
    text: "House Arkhē",
    value: "Hydor",
  },
  {
    id: 14,
    text: "Participation date of Tobiratory",
    value: "2021/06/21",
  },
  {
    id: 15,
    text: "House Arkhē",
    value: "Hydor",
  },
  {
    id: 16,
    text: "Participation date of Tobiratory",
    value: "2021/06/21",
  },
  {
    id: 17,
    text: "House Arkhē",
    value: "Hydor",
  },
  {
    id: 18,
    text: "Participation date of Tobiratory",
    value: "2021/06/21",
  },
];
