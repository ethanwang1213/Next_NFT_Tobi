import Image from "next/image";
import { MutableRefObject, useEffect, useRef, useState } from "react";

type NotifyHandlerType = (
  type: string,
  id: number,
  prevName: string,
  name: string,
) => void;

const CopyrightEditMenu = ({
  id,
  name,
  nofityHandler,
  closeHandler,
}: {
  id: number;
  name: string;
  nofityHandler: NotifyHandlerType;
  closeHandler: () => void;
}) => {
  const [inputValue, setInputValue] = useState(name);
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  const deleteHandler = () => {
    nofityHandler("delete", id, name, "");
  };

  const changeHandler = () => {
    if (inputValue != name) {
      nofityHandler("update", id, name, inputValue);
    } else {
      nofityHandler("close", id, name, "");
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeHandler();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={menuRef}
      className="w-52 h-[104px] bg-base-white 
        border-[1px] border-neutral-200 rounded-2xl 
        pt-4 flex flex-col gap-2 z-10"
      style={{
        boxShadow:
          "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <input
        type="text"
        className="h-6 mx-4 bg-secondary-100 border-[1px] border-secondary-500 rounded py-1 px-2
          text-secondary text-[10px] font-normal focus:outline-none"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        ref={inputRef}
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
      <div
        className="h-6 hover:bg-secondary-200 cursor-pointer
          px-4 py-2 flex gap-2 items-center"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();

          deleteHandler();
        }}
      >
        <Image
          width={16}
          height={16}
          src="/admin/images/icon/delete-icon.svg"
          alt="icon"
        />
        <span className="text-error text-[10px] font-normal">Delete</span>
      </div>
      <div className="mx-4 flex justify-end">
        <span
          className="w-14 h-4 bg-primary text-base-white rounded-[64px] 
          text-[10px] text-center cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();

            changeHandler();
          }}
        >
          Done
        </span>
      </div>
    </div>
  );
};

export default CopyrightEditMenu;
