import clsx from "clsx";
import { useCombobox, useMultipleSelection } from "downshift";
import { fetchCopyrights } from "fetchers/SampleActions";
import { useState, useMemo, useEffect } from "react";

const CopyrightMultiSelect = ({
  initialSelectedItems,
  handleSelectedItemChange,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [elements, setElements] = useState([]);

  const items = useMemo(
    () => getFilteredItems(selectedItems, inputValue),
    [selectedItems, inputValue],
  );

  function getFilteredItems(selectedItems, inputValue) {
    const lowerCasedInputValue = inputValue.toLowerCase();

    return elements.filter(
      (element) =>
        !selectedItems.includes(element) &&
        element.toLowerCase().startsWith(lowerCasedInputValue),
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCopyrights();
        setElements(data.map((item) => item.name));
      } catch (error) {
        // Handle errors here
        console.error("Error fetching copyrights:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setSelectedItems(initialSelectedItems);
  }, [initialSelectedItems]);

  const { getSelectedItemProps, getDropdownProps, removeSelectedItem } =
    useMultipleSelection({
      selectedItems,
      onStateChange({ selectedItems: newSelectedItems, type }) {
        console.log(
          "useMultipleSelection::onStateChange",
          type,
          newSelectedItems,
        );
        switch (type) {
          case useMultipleSelection.stateChangeTypes
            .SelectedItemKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
          case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
            setSelectedItems(newSelectedItems);
            handleSelectedItemChange(newSelectedItems);
            break;
          default:
            break;
        }
      },
    });
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    openMenu,
  } = useCombobox({
    items,
    inputValue,
    selectedItem: null,
    stateReducer(state, actionAndChanges) {
      const { changes, type } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            ...(changes.selectedItem && { isOpen: true, highlightedIndex: 0 }),
          };
        default:
          return changes;
      }
    },
    onStateChange({
      inputValue: newInputValue,
      type,
      selectedItem: newSelectedItem,
    }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          if (newSelectedItem != undefined) {
            setSelectedItems([...selectedItems, newSelectedItem]);
            handleSelectedItemChange([...selectedItems, newSelectedItem]);
          }
          else if (inputValue && inputValue.length > 0) {
            setSelectedItems([...selectedItems, inputValue]);
            handleSelectedItemChange([...selectedItems, inputValue]);
            setInputValue("");
            openMenu();
          }
          break;
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue);
          break;
        case useCombobox.stateChangeTypes.InputBlur:
          setInputValue(""); // Clear the input value on blur
          break;
        default:
          break;
      }
    },
  });
  return (
    <div
      className={clsx(
        "flex flex-col w-full justify-center self-center min-h-[52px]",
        "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
      )}
      onClick={() => {
        if (!isOpen) openMenu();
      }}
    >
      <div
        style={{
          display: "inline-flex",
          gap: "8px",
          alignItems: "center",
          flexWrap: "wrap",
          padding: "6px",
        }}
      >
        {selectedItems.map((selectedItem, index) => (
          <span
            style={{
              backgroundColor: "#1779DE",
              color: "#FFFFFF",
              paddingLeft: "8px",
              paddingRight: "8px",
              paddingTop: "4px",
              paddingBottom: "4px",
              borderRadius: "6px",
              fontWeight: 400,
              fontSize: "14px",
            }}
            key={`selected-item-${index}`}
            {...getSelectedItemProps({ selectedItem, index })}
          >
            @{selectedItem}
            <span
              style={{
                cursor: "pointer",
                padding: "4px",
              }}
              onClick={(e) => {
                e.stopPropagation();
                removeSelectedItem(selectedItem);
              }}
            >
              &#10005;
            </span>
          </span>
        ))}
        <div
          style={{
            display: "inline-block",
            marginLeft: "5px",
          }}
        >
          {
            <input
              className={clsx(
                "outline-[#FFA726] placeholder:text-sm placeholder:text-placeholder-color placeholder:font-normal",
                !isOpen ? "hidden" : "",
              )}
              style={{ padding: "4px" }}
              {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
            />
          }
        </div>
      </div>
      <ul
        {...getMenuProps()}
        style={{
          listStyle: "none",
          width: "100%",
          padding: "0",
          margin: "4px 0 0 0",
        }}
      >
        {isOpen &&
          items.map((item, index) => (
            <li
              style={{
                padding: "4px",
                backgroundColor: highlightedIndex === index ? "#bde4ff" : null,
              }}
              key={`${item}${index}`}
              {...getItemProps({ item, index })}
            >
              {item}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CopyrightMultiSelect;
