import clsx from "clsx";
import { useSelect } from "downshift";

const statusValues = [
  { value: 1, title: "Draft", color: "#093159" },
  { value: 2, title: "Private", color: "#505050" },
  { value: 3, title: "Viewing Only", color: "#37AD00" },
  { value: 4, title: "On Sale", color: "#DB6100" },
  { value: 5, title: "Unlisted", color: "#3F3F3F" },
  { value: 6, title: "Scheduled Publishing", color: "#277C00" },
  { value: 7, title: "Scheduled for Sale", color: "#9A4500" },
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
        <span>{selectedItem.title}</span>
        <span>{isOpen ? <>▲</> : <>▼</>}</span>
      </div>
      <ul
        className={`absolute w-72 bg-white mt-1 shadow-md p-0 z-10 ${
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
                "py-2 px-3 shadow-sm flex flex-col",
              )}
              key={item.value}
              {...getItemProps({ item, index })}
            >
              <span>{item.title}</span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default StatusDropdownSelect;
