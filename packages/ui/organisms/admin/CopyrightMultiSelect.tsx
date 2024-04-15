import clsx from "clsx";
import { useCombobox, useMultipleSelection } from "downshift";
import { useState } from "react";

const CopyrightMultiSelect = ({
  initialSelectedItems,
  handleSelectedItemChange,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedItems, setSelectedItems] = useState(initialSelectedItems);
  const items = [];

  const { getSelectedItemProps, getDropdownProps, removeSelectedItem } =
    useMultipleSelection({
      selectedItems,
      onStateChange({ selectedItems: newSelectedItems, type }) {
        switch (type) {
          case useMultipleSelection.stateChangeTypes
            .SelectedItemKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
          case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
            setSelectedItems(newSelectedItems);
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
    selectedItem,
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
          handleSelectedItemChange([...selectedItems, inputValue]);
          setSelectedItems([...selectedItems, inputValue]);
          setInputValue("");
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

  const showPlaceholder = selectedItems.length === 0;

  return (
    <div
      className={clsx(
        "flex flex-col w-full justify-center self-center",
        "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
      )}
      onClick={() => {
        openMenu();
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
        {selectedItems.map(
          function renderSelectedItem(selectedItemForRender, index) {
            return (
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
                {...getSelectedItemProps({
                  selectedItem: selectedItemForRender,
                  index,
                })}
              >
                @{selectedItemForRender}
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                <span
                  style={{ padding: "4px", cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedItem(selectedItemForRender);
                  }}
                >
                  &#10005;
                </span>
              </span>
            );
          },
        )}
        {
          <div className="px-2">
            <input
              style={{ padding: "4px" }}
              {...getInputProps({
                ...getDropdownProps({ preventKeyAction: isOpen }),
              })}
              data-testid="combobox-input"
              placeholder={showPlaceholder ? "Copyrights*" : ""}
              className="outline-[#FFA726] placeholder:text-sm placeholder:text-placeholder-color placeholder:font-normal"
            />
          </div>
        }
      </div>
      <ul
        {...getMenuProps()}
        style={{
          listStyle: "none",
          width: "100%",
          padding: "0",
          margin: "4px 0 0 0",
        }}
      ></ul>
    </div>
  );
};

export default CopyrightMultiSelect;
