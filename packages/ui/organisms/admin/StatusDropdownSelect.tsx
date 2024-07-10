import clsx from "clsx";
import { useSelect } from "downshift";
import NextImage from "next/image";
import {
  DigitalItemStatus,
  getDigitalItemStatusTitle,
} from "ui/types/adminTypes";

const statusValues = [
  { value: DigitalItemStatus.Draft, color: "#9E9E9E" },
  { value: DigitalItemStatus.Private, color: "#505050" },
  { value: DigitalItemStatus.ViewingOnly, color: "#009FF5" },
  { value: DigitalItemStatus.OnSale, color: "#FF811C" },
  { value: DigitalItemStatus.Unlisted, color: "#FF4747" },
];

const availableStatusValues = (status) => {
  switch (status) {
    case DigitalItemStatus.Draft:
      return [
        { value: DigitalItemStatus.Draft, color: "#9E9E9E" },
        { value: DigitalItemStatus.ViewingOnly, color: "#009FF5" },
        { value: DigitalItemStatus.OnSale, color: "#FF811C" },
      ];

    case DigitalItemStatus.Private:
      return [
        { value: DigitalItemStatus.Private, color: "#505050" },
        { value: DigitalItemStatus.ViewingOnly, color: "#009FF5" },
        { value: DigitalItemStatus.OnSale, color: "#FF811C" },
      ];

    case DigitalItemStatus.ViewingOnly:
      return [
        { value: DigitalItemStatus.ViewingOnly, color: "#009FF5" },
        { value: DigitalItemStatus.OnSale, color: "#FF811C" },
        { value: DigitalItemStatus.Unlisted, color: "#FF4747" },
      ];

    case DigitalItemStatus.OnSale:
      return [
        { value: DigitalItemStatus.ViewingOnly, color: "#009FF5" },
        { value: DigitalItemStatus.OnSale, color: "#FF811C" },
        { value: DigitalItemStatus.Unlisted, color: "#FF4747" },
      ];

    case DigitalItemStatus.Unlisted:
      return [
        { value: DigitalItemStatus.ViewingOnly, color: "#009FF5" },
        { value: DigitalItemStatus.OnSale, color: "#FF811C" },
        { value: DigitalItemStatus.Unlisted, color: "#FF4747" },
      ];

    default:
      break;
  }

  return [];
};

const StatusDropdownSelect = ({ initialStatus, handleSelectedItemChange }) => {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items: availableStatusValues(initialStatus),
    initialSelectedItem: statusValues[initialStatus - 1],
    onSelectedItemChange: handleSelectedItemChange,
  });

  return (
    <div>
      <div
        className={`w-[184px] h-[40px] rounded-[8px] border-2 border-secondary 
          pl-3 text-secondary flex items-center cursor-pointer`}
        {...getToggleButtonProps()}
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="5" fill={selectedItem.color} />
        </svg>
        <span className="w-[116px] text-base font-semibold ml-2">
          {getDigitalItemStatusTitle(selectedItem.value)}
        </span>
        {isOpen ? (
          <NextImage
            src="/admin/images/icon/arrow_collapse.svg"
            width={20}
            height={20}
            alt="icon"
          />
        ) : (
          <NextImage
            src="/admin/images/icon/arrow_drop_down.svg"
            width={20}
            height={20}
            alt="icon"
          />
        )}
      </div>
      <ul
        className={`absolute w-[184px] bg-[#FAFAFA] rounded-[16px] border-2 border-[#D6D6D6] px-2 py-2 z-10  ${
          !isOpen && "hidden"
        }`}
        {...getMenuProps()}
      >
        {isOpen &&
          availableStatusValues(initialStatus).map((item, index) => (
            <li
              className={clsx(
                highlightedIndex === index && "bg-blue-300 text-white",
                selectedItem.value === item.value && "font-bold",
                "pl-1 h-[24px] flex items-center rounded-[8px]",
                availableStatusValues(initialStatus).length == index + 1
                  ? ""
                  : "border-b-[0.5px] border-[#E4E4E4]",
              )}
              key={item.value}
              {...getItemProps({ item, index })}
            >
              <svg width="16" height="16" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="5" fill={item.color} />
              </svg>
              <span className="ml-2 text-xs font-medium">
                {getDigitalItemStatusTitle(item.value)}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default StatusDropdownSelect;
