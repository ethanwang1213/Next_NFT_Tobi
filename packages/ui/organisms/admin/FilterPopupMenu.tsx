import { FILTER, FILTER_TYPE } from "types/adminTypes";
import PopupMenu from "ui/molecules/PopupMenu";

const filters: Array<FILTER> = [
  {
    type: FILTER_TYPE.CHECKBOX,
    label: "出品中",
  },
  {
    type: FILTER_TYPE.CHECKBOX,
    label: "未出品",
  },
  {
    type: FILTER_TYPE.CHECKBOX,
    label: "公開",
  },
  {
    type: FILTER_TYPE.CHECKBOX,
    label: "非公開",
  },
  {
    type: FILTER_TYPE.CHECKBOX,
    label: "下書き",
  },
  {
    type: FILTER_TYPE.CHECKBOX,
    label: "金額",
    children: [
      { type: FILTER_TYPE.RADIO, label: "昇順" },
      { type: FILTER_TYPE.RADIO, label: "降順" },
    ],
  },
  {
    type: FILTER_TYPE.CHECKBOX,
    label: "公開日",
    children: [
      { type: FILTER_TYPE.RADIO, label: "昇順" },
      { type: FILTER_TYPE.RADIO, label: "降順" },
    ],
  },
];

export default function FilterPopupMenu(props) {
  return <PopupMenu {...{ filters, ...props }} />;
}
