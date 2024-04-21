import clsx from "clsx";
import { useCombobox, useMultipleSelection } from "downshift";
import {
  fetchCopyrights,
  updateCopyright,
  deleteCopyright,
} from "fetchers/SampleActions";
import { useState, useMemo, useEffect, useRef } from "react";
import SelectItemEditMenu from "./SelectItemEditMenu";

const CopyrightMultiSelect = ({
  initialSelectedItems,
  handleSelectedItemChange,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [elements, setElements] = useState([]);
  const items = useMemo(
    () => getFilteredItems(selectedItems, elements),
    [selectedItems, elements],
  );
  const inputRef = useRef(null); // Add a ref for the input element

  function getFilteredItems(selItems, defaultItems) {
    // Create a copy of the elements array to avoid mutating the original array
    const updateElements = [...defaultItems];
    selItems.forEach((item: string) => {
      const found: boolean = elements.some((element) => element.name === item);
      if (!found) {
        updateElements.push({ id: 0, name: item, popup: false });
      }
    });
    if (updateElements.length != defaultItems.length) {
      setElements(updateElements);
    }

    return updateElements.map((element) => element.name);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCopyrights();
        if (data.length > 0) {
          data.map((item, index) => {
            item.popup = false;
          });
        }
        setElements(data);
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
        switch (type) {
          case useMultipleSelection.stateChangeTypes
            .SelectedItemKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
          case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
            setSelectedItems(newSelectedItems);
            handleSelectedItemChange(newSelectedItems);
            if (elements.length > 0) {
              openMenu();
            }
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
            ...(changes.selectedItem && { isOpen: true }),
          };
        case useCombobox.stateChangeTypes.InputClick:
          return {
            ...changes,
            ...{ isOpen: true },
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
            if (selectedItems.indexOf(newSelectedItem) == -1) {
              // check duplicated
              setSelectedItems([...selectedItems, newSelectedItem]);
              handleSelectedItemChange([...selectedItems, newSelectedItem]);
            }
            // close menu
            let newElements = [...elements];
            newElements.forEach((value) => (value.popup = false));
            setElements(newElements);
          } else if (inputValue && inputValue.length > 0) {
            if (selectedItems.indexOf(inputValue) == -1) {
              // check duplicated
              setSelectedItems([...selectedItems, inputValue]);
              handleSelectedItemChange([...selectedItems, inputValue]);
            }
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

  const itemChangedHandler = async (type, id, prevValue, value) => {
    let newElements = [...elements];
    let newSelectedItems = [...selectedItems];

    // get indexes
    const elementIndex = newElements.findIndex(
      (value) => value.name == prevValue,
    );
    const selItemIndex = newSelectedItems.indexOf(prevValue);

    if (type == "update") {
      let update = true;
      // call API
      if (id > 0) {
        update = await updateCopyright(id, value);
      }
      // update UI
      if (update) {
        // change element name
        newElements[elementIndex].name = value;
        // change selected itam name
        if (selItemIndex > -1) {
          newSelectedItems[selItemIndex] = value;
          // update selected items
          setSelectedItems(newSelectedItems);
        }
      }
    }

    if (type == "delete") {
      let update = true;
      // call API
      if (id > 0) {
        update = await deleteCopyright(id);
      }
      // update UI
      if (update) {
        // delete element
        newElements = newElements.filter(
          (value, index) => index != elementIndex,
        );
        // delete selected itam
        if (selItemIndex > -1) {
          setSelectedItems(
            newSelectedItems.filter((value, index) => index != selItemIndex),
          );
        }
      }
    }

    // close all popup menu
    newElements.forEach((value) => (value.popup = false));
    setElements(newElements);
  };

  return (
    <div
      className={clsx(
        "flex flex-col w-full justify-center self-center min-h-[52px]",
        "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
      )}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();

        if (!isOpen) {
          // close all opened popup menus
          let newElements = [...elements];
          newElements.forEach((value) => (value.popup = false));
          setElements(newElements);
          // open items
          openMenu();
        }
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
            ©{selectedItem}
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
              id="copyright-input"
              className={clsx(
                "outline-none placeholder:text-sm placeholder:text-placeholder-color placeholder:font-normal",
                !isOpen ? "hidden" : "",
              )}
              style={{ padding: "4px" }}
              {...getInputProps({
                ...getDropdownProps({ preventKeyAction: isOpen }),
                id: "main-input-id",
              })}
            />
          }
        </div>
      </div>
      <ul
        {...getMenuProps()}
        style={{
          listStyle: "none",
          width: "100%",
          padding: "4px",
          margin: "4px 0 0 0",
        }}
        className={clsx(isOpen && elements.length > 0 ? "" : "hidden")}
      >
        {elements.map((item, index) => (
          <li
            style={{
              padding: "4px 8px",
              borderRadius: "8px",
            }}
            className="flex justify-between items-center 
                cursor-pointer hover:bg-secondary-200 relative"
            key={`${item.name}${index}`}
            {...getItemProps({ item, index })}
          >
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
            >
              ©{item.name}
            </span>
            <span
              className="hover:bg-secondary-400"
              style={{
                color: "#FFFFFF",
                paddingLeft: "12px",
                paddingRight: "12px",
                paddingTop: "4px",
                paddingBottom: "4px",
                borderRadius: "6px",
                fontWeight: 400,
                fontSize: "14px",
              }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                // popup menu
                let newElements = [...elements];
                newElements.forEach((value, i) => {
                  value.popup = i == index;
                });
                setElements(newElements);
              }}
            >
              •••
            </span>
            <div
              className={clsx(
                "right-0, top-0 z-10",
                item.popup ? "absolute" : "hidden",
              )}
            >
              <SelectItemEditMenu
                id={item.id}
                name={item.name}
                focusInput={item.popup}
                nofityHandler={itemChangedHandler}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CopyrightMultiSelect;