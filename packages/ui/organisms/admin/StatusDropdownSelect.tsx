import clsx from "clsx";
import { useSelect } from "downshift";

export enum SampleStatus {
  Draft = 1,
  Private,
  ViewingOnly,
  OnSale,
  Unlisted,
  ScheduledPublishing,
  ScheduledforSale,
  SampleStatusCount,
}

export const formatSampleStatus = (status) => {
  let value;
  switch (status) {
    case SampleStatus.Draft:
      value = "Draft";
      break;
    case SampleStatus.Private:
      value = "Private";
      break;
    case SampleStatus.ViewingOnly:
      value = "Viewing Only";
      break;
    case SampleStatus.OnSale:
      value = "On Sale";
      break;
    case SampleStatus.Unlisted:
      value = "Unlisted";
      break;
    case SampleStatus.ScheduledPublishing:
      value = "Scheduled Publishing";
      break;
    case SampleStatus.ScheduledforSale:
      value = "Scheduled for Sale";
      break;
    default:
      value = "";
      break;
  }
  return value;
};

const statusValues = [
  { value: SampleStatus.Draft, color: "#093159" },
  { value: SampleStatus.Private, color: "#505050" },
  { value: SampleStatus.ViewingOnly, color: "#37AD00" },
  { value: SampleStatus.OnSale, color: "#DB6100" },
  { value: SampleStatus.Unlisted, color: "#3F3F3F" },
  { value: SampleStatus.ScheduledPublishing, color: "#277C00" },
  { value: SampleStatus.ScheduledforSale, color: "#9A4500" },
];

const StatusDropdownSelect = ({ initialIndex, handleSelectedItemChange }) => {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items: statusValues,
    initialSelectedItem: statusValues[initialIndex],
    onSelectedItemChange: handleSelectedItemChange,
  });

  return (
    <div>
      <div
        className="w-64 h-12 px-6 text-[#000000] flex justify-between items-center cursor-pointer rounded-[48px]"
        style={{
          backgroundColor: `${selectedItem.color}`,
        }}
        {...getToggleButtonProps()}
      >
        <span>{formatSampleStatus(selectedItem.value)}</span>
        <span>{isOpen ? <>▲</> : <>▼</>}</span>
      </div>
      <ul
        className={`absolute w-72 bg-[#FAFAFA] shadow-md px-2 py-2 z-10 rounded-[20px] ${
          !isOpen && "hidden"
        }`}
        {...getMenuProps()}
      >
        {isOpen &&
          statusValues.map((item, index) => (
            <li
              className={clsx(
                highlightedIndex === index && "bg-blue-300",
                selectedItem === item && "font-bold",
                "py-1 px-3 flex flex-col rounded-[20px] my-1",
              )}
              key={item.value}
              {...getItemProps({ item, index })}
            >
              <span>{formatSampleStatus(item.value)}</span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default StatusDropdownSelect;
