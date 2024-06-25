import clsx from "clsx";
import { useSelect } from "downshift";
import { DigitalItemStatus } from "ui/types/adminTypes";

export const getDigitalItemStatusTitle = (status) => {
  let value;
  switch (status) {
    case DigitalItemStatus.Draft:
      value = "Draft";
      break;
    case DigitalItemStatus.Private:
      value = "Private";
      break;
    case DigitalItemStatus.ViewingOnly:
      value = "Viewing Only";
      break;
    case DigitalItemStatus.OnSale:
      value = "On Sale";
      break;
    case DigitalItemStatus.Unlisted:
      value = "Unlisted";
      break;
    default:
      value = "";
      break;
  }
  return value;
};

const statusValues = [
  { value: DigitalItemStatus.Draft, color: "#093159" },
  { value: DigitalItemStatus.Private, color: "#505050" },
  { value: DigitalItemStatus.ViewingOnly, color: "#37AD00" },
  { value: DigitalItemStatus.OnSale, color: "#DB6100" },
  { value: DigitalItemStatus.Unlisted, color: "#3F3F3F" },
];

const availableStatusValues = (status) => {
  switch (status) {
    case DigitalItemStatus.Draft:
      return [
        { value: DigitalItemStatus.Draft, color: "#093159" },
        { value: DigitalItemStatus.ViewingOnly, color: "#37AD00" },
        { value: DigitalItemStatus.OnSale, color: "#DB6100" },
      ];

    case DigitalItemStatus.Private:
      return [
        { value: DigitalItemStatus.Private, color: "#505050" },
        { value: DigitalItemStatus.ViewingOnly, color: "#37AD00" },
        { value: DigitalItemStatus.OnSale, color: "#DB6100" },
      ];

    case DigitalItemStatus.ViewingOnly:
      return [
        { value: DigitalItemStatus.ViewingOnly, color: "#37AD00" },
        { value: DigitalItemStatus.OnSale, color: "#DB6100" },
        { value: DigitalItemStatus.Unlisted, color: "#3F3F3F" },
      ];

    case DigitalItemStatus.OnSale:
      return [
        { value: DigitalItemStatus.ViewingOnly, color: "#37AD00" },
        { value: DigitalItemStatus.OnSale, color: "#DB6100" },
        { value: DigitalItemStatus.Unlisted, color: "#3F3F3F" },
      ];

    case DigitalItemStatus.Unlisted:
      return [
        { value: DigitalItemStatus.ViewingOnly, color: "#37AD00" },
        { value: DigitalItemStatus.OnSale, color: "#DB6100" },
        { value: DigitalItemStatus.Unlisted, color: "#3F3F3F" },
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
        className="w-64 h-12 px-6 text-white flex justify-between items-center cursor-pointer rounded-[48px]"
        style={{
          backgroundColor: `${selectedItem.color}`,
        }}
        {...getToggleButtonProps()}
      >
        <span style={{ fontSize: 18 }}>
          {getDigitalItemStatusTitle(selectedItem.value)}
        </span>
        <span>{isOpen ? <>▲</> : <>▼</>}</span>
      </div>
      <ul
        className={`absolute w-72 bg-[#FAFAFA] shadow-md px-2 py-2 z-10 rounded-[20px] ${
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
                "py-1 px-3 flex flex-col rounded-[20px] my-1",
              )}
              key={item.value}
              {...getItemProps({ item, index })}
            >
              <span>{getDigitalItemStatusTitle(item.value)}</span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default StatusDropdownSelect;
