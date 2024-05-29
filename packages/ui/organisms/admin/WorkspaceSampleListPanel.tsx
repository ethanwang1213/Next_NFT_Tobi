import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Button from "ui/atoms/Button";
import { SampleItem } from "ui/types/DigitalItems";

const SampleItemComponent = (props: {
  thumbnail: string;
  name: string;
  selectState: boolean;
  checked: boolean;
  changeHandler: (value: boolean) => void;
  selectHandler: () => void;
}) => {
  const checkboxRef = useRef(null);

  const clickHandler = useCallback(() => {
    if (props.selectState) {
      if (checkboxRef.current) {
        checkboxRef.current.click();
      }
    } else {
      props.selectHandler();
    }
  }, [props]);

  return (
    <div
      className="flex items-center gap-8 py-3 pl-10 pr-6 hover:bg-[#787878]"
      onClick={clickHandler}
    >
      {props.selectState && (
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={props.checked}
          onChange={(e) => props.changeHandler(e.target.checked)}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      )}
      <Image
        width={80}
        height={80}
        src={props.thumbnail}
        alt="thumbnail image"
      />
      <span className="text-white text-base font-semibold">{props.name}</span>
    </div>
  );
};

const WorkspaceSampleListPanel = (props: {
  isOpen: boolean;
  closeHandler: () => void;
  data: SampleItem[];
  createHandler: () => void;
  selectHandler: (id: number) => void;
  deleteHandler: (ids: number[]) => void;
}) => {
  const [selectState, setSelectState] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const panelRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        props.isOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target)
      ) {
        props.closeHandler();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [props]);

  const selectionChangeHandler = (selId: number, checked: boolean) => {
    const prevIndex = selectedItems.findIndex((value) => value === selId);
    const newItems = [...selectedItems];
    if (checked) {
      if (prevIndex === -1) {
        newItems.push(selId);
        setSelectedItems(newItems);
      }
    } else {
      if (prevIndex > -1) {
        newItems.splice(prevIndex, 1);
        setSelectedItems(newItems);
      }
    }
  };

  // reset selected items array when the data is updated
  useEffect(() => {
    setSelectedItems([]);
  }, [props.data]);

  return (
    <div
      className="absolute top-0 w-[448px] bg-[#001327] h-full py-8 
      flex flex-col gap-6 z-20"
      style={{ transition: "right 0.3s ease", right: props.isOpen ? 0 : -448 }}
      ref={panelRef}
    >
      <div className="w-full pr-4 flex justify-end gap-4">
        <Image
          width={32}
          height={32}
          src="/admin/images/icon/delete-icon.svg"
          alt="delete icon"
          className="cursor-pointer"
          onClick={() => setSelectState(!selectState)}
        />
        <Image
          width={32}
          height={32}
          src="/admin/images/icon/close-white.svg"
          alt="close icon"
          className="cursor-pointer"
          onClick={() => props.closeHandler()}
        />
      </div>
      <Button
        className={`w-[384px] rounded-[64px] ml-10 mr-6 px-4 py-2 
        flex justify-center items-center gap-2
        ${selectState ? "bg-[#BAB8B8]" : "bg-primary"}`}
        disabled={selectState}
        onClick={props.createHandler}
      >
        <Image
          width={10}
          height={13}
          src="/admin/images/icon/sample-icon.svg"
          alt="new icon"
        />
        <span className="text-base-white text-sm font-semibold">
          Create New Item
        </span>
      </Button>
      <div className="flex-1 overflow-y-auto">
        <div className="w-full flex flex-col">
          {props.data &&
            props.data.map((sample, index) => (
              <SampleItemComponent
                key={`sample-${sample.id}`}
                thumbnail={sample.thumbUrl}
                name={sample.name}
                selectState={selectState}
                checked={
                  selectedItems.findIndex((value) => value == sample.id) > -1
                }
                changeHandler={(value) =>
                  selectionChangeHandler(sample.id, value)
                }
                selectHandler={() => props.selectHandler(index)}
              />
            ))}
        </div>
      </div>
      {selectState && (
        <div className="flex justify-center">
          <Button
            className="bg-[#EA1010] rounded-[88px] w-[160px] h-[48px]
              text-xl font-normal text-white text-center"
            onClick={() => {
              props.deleteHandler(selectedItems);
            }}
          >
            DELETE
          </Button>
        </div>
      )}
      {selectState && (
        <span className="text-white text-xl font-normal text-center">
          selected {selectedItems.length} item
        </span>
      )}
    </div>
  );
};

export default WorkspaceSampleListPanel;
