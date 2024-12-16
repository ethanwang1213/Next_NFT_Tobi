import clsx from "clsx";
import { useCombobox, useMultipleSelection } from "downshift";
import useRestfulAPI from "hooks/useRestfulAPI";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import CopyrightEditMenu from "./CopyrightEditMenu";

const CopyrightMultiSelect = ({
  initialSelectedItems,
  readOnly,
  handleSelectedItemChange,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [popupMenuOpen, setPopupMenuOpen] = useState(false);
  const [popupMenuPosition, setPopupMenuPosition] = useState({
    x: 0,
    y: 0,
    id: 0,
    text: "",
  });
  const t = useTranslations("ItemDetail");

  const apiUrl = "native/admin/copyrights";
  const {
    data: elements,
    setData,
    postData,
    deleteData,
  } = useRestfulAPI(apiUrl);

  const rootElementRef = useRef(null);

  const items = useMemo(() => {
    // Create a copy of the elements array to avoid mutating the original array
    if (!elements) return [];
    const updateElements = [...elements];
    selectedItems.forEach((item) => {
      const found: boolean = elements.some(
        (element) => element.name === item.name,
      );
      if (!found) {
        updateElements.push({ id: null, name: item.name });
      }
    });
    if (updateElements.length != elements.length) {
      setData(updateElements);
    }

    return updateElements;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems, elements]);

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
          } else if (inputValue && inputValue.length > 0) {
            if (
              selectedItems.findIndex(
                (value, index) => value.name == inputValue,
              ) == -1
            ) {
              // check duplicated
              setSelectedItems([
                ...selectedItems,
                { id: null, name: inputValue },
              ]);
              handleSelectedItemChange([
                ...selectedItems,
                { id: null, name: inputValue },
              ]);
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
    setPopupMenuOpen(false);

    let newElements = [...elements];
    let newSelectedItems = [...selectedItems];

    // get indexes
    const elementIndex = newElements.findIndex(
      (value) => value.name == prevValue,
    );
    const selItemIndex = newSelectedItems.findIndex(
      (value) => value.name == prevValue,
    );

    if (type == "update") {
      let update = true;
      // call API
      if (id > 0) {
        update = await postData(`${apiUrl}/${id}`, { name: value });
      }
      // update UI
      if (update) {
        // change element name
        newElements[elementIndex].name = value;
        // change selected itam name
        if (selItemIndex > -1) {
          newSelectedItems[selItemIndex].name = value;
          // update selected items
          setSelectedItems(newSelectedItems);
        }
        setData(newElements);
      }
    }

    if (type == "delete") {
      let update = true;
      // call API
      if (id > 0) {
        update = await deleteData(`${apiUrl}/${id}`);
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
        setData(newElements);
      }
    }
  };

  return (
    <div
      className={clsx(
        "flex flex-col w-full justify-center self-center min-h-[52px]",
        "outline-none border-2 rounded-lg border-secondary",
        readOnly
          ? "bg-secondary-200"
          : "hover:border-hover-color focus:border-focus-color",
        "relative",
      )}
      ref={rootElementRef}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();

        if (!isOpen && !readOnly) {
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
            ©{selectedItem.name}
            {!readOnly ? (
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
            ) : (
              <></>
            )}
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
        className={clsx(isOpen && items.length > 0 ? "" : "hidden")}
      >
        <p className="text-[12px] pl-[20px] mb-2">{t("SelectCopyrights")}</p>
        {items.map((item, index) => (
          <li
            style={{
              padding: "4px 8px",
              borderRadius: "8px",
            }}
            className="flex justify-between items-center 
        cursor-pointer hover:bg-secondary-200"
            key={`${item.name}${index}`}
            {...getItemProps({ item, index })}
          >
            <div className="flex gap-2">
              <Image
                width={7}
                height={11}
                alt="more move"
                src="/admin/images/icon/more-move.svg"
              />
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
            </div>
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

                const rootDomRect = (
                  rootElementRef.current as HTMLElement
                ).getBoundingClientRect();
                const targetDomRect = (
                  e.target as HTMLElement
                ).getBoundingClientRect();

                setPopupMenuPosition({
                  x: targetDomRect.right - rootDomRect.left,
                  y: targetDomRect.top - rootDomRect.top,
                  id: item.id,
                  text: item.name,
                });
                setPopupMenuOpen(true);
              }}
            >
              •••
            </span>
          </li>
        ))}
        {inputValue && !items.some((item) => item.name === inputValue) && (
          <li
            className="p-[6px] rounded-[8px] bg-secondary-200 cursor-pointer mt-1"
            onClick={() => {
              const newItem = { id: null, name: inputValue };
              setSelectedItems([...selectedItems, newItem]);
              handleSelectedItemChange([...selectedItems, newItem]);
              setInputValue("");
            }}
          >
            <span className="text-[11px] mr-2 text-black">{t("Create")}:</span>
            <span className="text-[14px] bg-primary p-1 pr-5 text-white rounded-[6px]">
              ©{inputValue}
            </span>
          </li>
        )}
        {popupMenuOpen && (
          <div
            style={{
              position: "absolute",
              top: popupMenuPosition.y,
              left: popupMenuPosition.x,
              zIndex: 1,
            }}
          >
            <CopyrightEditMenu
              id={popupMenuPosition.id}
              name={popupMenuPosition.text}
              nofityHandler={itemChangedHandler}
              closeHandler={() => setPopupMenuOpen(false)}
            />
          </div>
        )}
      </ul>
    </div>
  );
};

export default CopyrightMultiSelect;
