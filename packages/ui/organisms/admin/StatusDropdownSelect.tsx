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

export const getSampleStatusTitle = (status) => {
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

const availableStatusValues = (status) => {
  switch (status) {
    case SampleStatus.Draft:
      return [
        { value: SampleStatus.Draft, color: "#093159" },
        { value: SampleStatus.ViewingOnly, color: "#37AD00" },
        { value: SampleStatus.OnSale, color: "#DB6100" },
        { value: SampleStatus.ScheduledPublishing, color: "#277C00" },
        { value: SampleStatus.ScheduledforSale, color: "#9A4500" },
      ];

    case SampleStatus.Private:
      return [
        { value: SampleStatus.Private, color: "#505050" },
        { value: SampleStatus.ViewingOnly, color: "#37AD00" },
        { value: SampleStatus.OnSale, color: "#DB6100" },
        { value: SampleStatus.ScheduledPublishing, color: "#277C00" },
        { value: SampleStatus.ScheduledforSale, color: "#9A4500" },
      ];

    case SampleStatus.ViewingOnly:
      return [
        { value: SampleStatus.ViewingOnly, color: "#37AD00" },
        { value: SampleStatus.OnSale, color: "#DB6100" },
        { value: SampleStatus.Unlisted, color: "#3F3F3F" },
        { value: SampleStatus.ScheduledforSale, color: "#9A4500" },
      ];

    case SampleStatus.OnSale:
      return [
        { value: SampleStatus.ViewingOnly, color: "#37AD00" },
        { value: SampleStatus.OnSale, color: "#DB6100" },
        { value: SampleStatus.Unlisted, color: "#3F3F3F" },
        { value: SampleStatus.ScheduledPublishing, color: "#277C00" },
      ];

    case SampleStatus.Unlisted:
      return [
        { value: SampleStatus.ViewingOnly, color: "#37AD00" },
        { value: SampleStatus.OnSale, color: "#DB6100" },
        { value: SampleStatus.Unlisted, color: "#3F3F3F" },
        { value: SampleStatus.ScheduledPublishing, color: "#277C00" },
        { value: SampleStatus.ScheduledforSale, color: "#9A4500" },
      ];

    case SampleStatus.ScheduledPublishing:
      return [
        { value: SampleStatus.OnSale, color: "#DB6100" },
        { value: SampleStatus.Unlisted, color: "#3F3F3F" },
        { value: SampleStatus.ScheduledPublishing, color: "#277C00" },
        { value: SampleStatus.ScheduledforSale, color: "#9A4500" },
      ];

    case SampleStatus.ScheduledforSale:
      return [
        { value: SampleStatus.ViewingOnly, color: "#37AD00" },
        { value: SampleStatus.Unlisted, color: "#3F3F3F" },
        { value: SampleStatus.ScheduledPublishing, color: "#277C00" },
        { value: SampleStatus.ScheduledforSale, color: "#9A4500" },
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
        <span>{getSampleStatusTitle(selectedItem.value)}</span>
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
                highlightedIndex === index && "bg-blue-300",
                selectedItem === item && "font-bold",
                "py-1 px-3 flex flex-col rounded-[20px] my-1",
              )}
              key={item.value}
              {...getItemProps({ item, index })}
            >
              <span>{getSampleStatusTitle(item.value)}</span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default StatusDropdownSelect;
