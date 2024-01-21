import { FILTER_TYPE, FILTER } from "ui/atoms/PopupMenuItemType";
import PopupMenu from "ui/molecules/PopupMenu";

const filters: Array<FILTER> = [
  {
    type: FILTER_TYPE.RADIO,
    label: "公開",
  },
  {
    type: FILTER_TYPE.RADIO,
    label: "非公開",
  },
  {
    type: FILTER_TYPE.RADIO,
    label: "予約公開",
  },
];

export default function PublishPopupMenu(props) {
  //   return <PopupMenu {...{ filters, ...props }} />;
  return <div />;
}
