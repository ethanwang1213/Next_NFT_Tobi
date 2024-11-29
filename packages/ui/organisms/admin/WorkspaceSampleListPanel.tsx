import { useWorkspaceEditUnity } from "contexts/WorkspaceEditUnityContext";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Button from "ui/atoms/Button";
import { SampleItem } from "ui/types/adminTypes";
import DeleteConfirmDialog2 from "./DeleteConfirmDialog2";

type ItemProps = {
  thumbnail: string;
  name: string;
  selectState: boolean;
  checked: boolean;
  changeHandler: (value: boolean) => void;
  selectHandler: () => void;
  dragStartHandler: () => void;
};

const SampleItemComponent: React.FC<ItemProps> = (props) => {
  const checkboxRef = useRef(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const t = useTranslations("Workspace");

  const clickHandler = useCallback(() => {
    if (props.selectState) {
      if (checkboxRef.current) {
        checkboxRef.current.click();
      }
    } else {
      props.selectHandler();
    }
  }, [props]);

  const onMouseDown = (event: React.MouseEvent) => {
    if (props.selectState) return;
    dragStartPos.current = { x: event.clientX, y: event.clientY };
  };

  const onMouseMove = (event: React.MouseEvent) => {
    if (props.selectState) return;
    if (dragStartPos.current) {
      const dx = event.clientX - dragStartPos.current.x;
      const dy = event.clientY - dragStartPos.current.y;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        dragStartPos.current = null;
        props.dragStartHandler();
      }
    }
  };

  const onMouseUp = () => {
    dragStartPos.current = null;
  };

  return (
    <div
      className="flex items-center gap-8 py-3 pl-10 pr-6 hover:bg-[#787878]"
      onClick={clickHandler}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
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
        className="h-[80px] object-contain"
        src={props.thumbnail}
        alt="thumbnail image"
        draggable={false}
      />
      <span className="text-white text-base font-semibold">{props.name}</span>
    </div>
  );
};

type ListProps = {
  isOpen: boolean;
  closeHandler: () => void;
  data: SampleItem[];
  createHandler: () => void;
  selectHandler: (index: number) => void;
  deleteHandler: (ids: number[]) => void;
  dragHandler: (index: number) => void;
  showRestoreMenu: boolean;
};

const WorkspaceSampleListPanel: React.FC<ListProps> = (props) => {
  const [selectState, setSelectState] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const panelRef = useRef(null);
  const deleteConfirmDlgRef = useRef<HTMLDialogElement>(null);
  const t = useTranslations("Workspace");

  const { handleMouseUp } = useWorkspaceEditUnity();

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

  const deleteConfirmDialogHandler = useCallback(
    (value: string) => {
      if (value == "delete") {
        props.deleteHandler(selectedItems);
      }
    },
    [props, selectedItems],
  );

  return (
    <div
      className="absolute top-0 lg:w-[448px] w-[330px] bg-[#001327] h-full pt-8 z-20 flex flex-col gap-6 pointer-events-auto"
      style={{ transition: "right 0.3s ease", right: props.isOpen ? 0 : -448 }}
      ref={panelRef}
    >
      {props.showRestoreMenu && (
        <div
          className="absolute w-full h-full top-0 bg-secondary bg-opacity-75 backdrop-blur-sm 
            flex flex-col gap-6 justify-center items-center z-10 select-none"
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
        >
          <span className="text-white lg:text-[32px] text-[24px] font-bold">
            Return to the Inventory
          </span>
          <Image
            width={48}
            height={48}
            src="/admin/images/icon/keyboard_return.svg"
            alt="return icon"
            draggable={false}
          />
        </div>
      )}
      <div className="w-full pr-4 flex justify-end gap-4">
        <span
          className="material-symbols-outlined text-base-white cursor-pointer"
          style={{ fontSize: 26.7 }}
          onClick={() => setSelectState(!selectState)}
        >
          library_add_check
        </span>
        <span
          className="material-symbols-outlined text-base-white cursor-pointer"
          style={{ fontSize: 26.7 }}
          onClick={() => {
            setSelectState(false);
            props.closeHandler();
          }}
        >
          close
        </span>
      </div>
      <Button
        className={`rounded-[64px] ml-10 mr-6 px-4 py-2 
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
          {t("CreateNewItem")}
        </span>
      </Button>
      <div
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="w-full flex flex-col">
          {props.data &&
            [...props.data].reverse().map((sample, reversedIndex) => {
              const isChecked =
                selectedItems
                  .slice()
                  .reverse()
                  .findIndex((value) => value === sample.sampleItemId) > -1;
              const originalIndex = props.data.length - 1 - reversedIndex;
              return (
                <SampleItemComponent
                  key={`sample-${sample.sampleItemId}`}
                  thumbnail={sample.thumbUrl}
                  name={sample.name}
                  selectState={selectState}
                  checked={isChecked}
                  changeHandler={(value) =>
                    selectionChangeHandler(sample.sampleItemId, value)
                  }
                  selectHandler={() => props.selectHandler(originalIndex)}
                  dragStartHandler={() => props.dragHandler(originalIndex)}
                />
              );
            })}
        </div>
      </div>
      {selectState && (
        <div className="flex justify-center">
          <Button
            className="bg-[#EA1010] rounded-[88px] w-[160px] h-[48px]
              text-xl font-normal text-white text-center"
            onClick={() => {
              if (deleteConfirmDlgRef.current && selectedItems.length > 0) {
                deleteConfirmDlgRef.current.showModal();
              }
            }}
          >
            {t("Delete")}
          </Button>
        </div>
      )}
      {selectState && (
        <span className="text-white text-xl font-normal text-center">
          {t("SelectedItemCount", { count: selectedItems.length })}
        </span>
      )}
      <DeleteConfirmDialog2
        dialogRef={deleteConfirmDlgRef}
        changeHandler={deleteConfirmDialogHandler}
      />
    </div>
  );
};

export default WorkspaceSampleListPanel;
