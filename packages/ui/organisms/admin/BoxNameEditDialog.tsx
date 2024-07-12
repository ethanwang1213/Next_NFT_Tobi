import Image from "next/image";
import React from "react";
import { MutableRefObject, useEffect, useState } from "react";
import Button from "ui/atoms/Button";

const NAME_MAX_LENGTH = 64;

const BoxNameEditDialog = ({
  initialValue,
  dialogRef,
  changeHandler,
}: {
  initialValue: string;
  dialogRef: MutableRefObject<HTMLDialogElement>;
  changeHandler: (value: string) => void;
}) => {
  const [boxName, setBoxName] = useState("");
  const [lengthError, setLengthError] = useState(false);

  useEffect(() => {
    setBoxName(initialValue);
  }, [initialValue]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-[515px] rounded-3xl pt-4 flex flex-col gap-3 relative">
        <form method="dialog">
          <button className="absolute w-4 h-4 top-4 right-4">
            <Image
              src="/admin/images/icon/close2.svg"
              width={16}
              height={16}
              alt="close icon"
            />
          </button>
        </form>
        <div className="text-base-black text-lg font-semibold"></div>
        <div className="flex justify-between items-center gap-4">
          <span className="text-base-black text-sm font-semibold">
            Box Name
          </span>
          <input
            type="text"
            className="flex-1 rounded-[64px] border-[1px] border-neutral-200 py-2 pl-3 pr-12 outline-none
            text-base-black text-sm leading-4 font-normal"
            value={boxName}
            onChange={(e) => {
              setBoxName(e.target.value);
              if (e.target.value.length > NAME_MAX_LENGTH) {
                setLengthError(true);
              } else {
                setLengthError(false);
              }
            }}
          />
        </div>
        <span className="text-error text-[11px] font-normal text-right -mt-1 mb-1">
          {lengthError ? "The box name is too long." : ""}
        </span>
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            className="px-4 py-2 rounded-[64px] border-2 border-primary
              text-primary text-sm leading-4 font-semibold"
            onClick={() => {
              setBoxName(initialValue);
              setLengthError(false);
              dialogRef.current.close();
            }}
          >
            Cancel
          </Button>
          <Button
            className={`px-4 py-2 rounded-[64px] 
              ${lengthError ? "bg-inactive" : "bg-primary"}
              text-base-white text-sm leading-4 font-semibold`}
            onClick={() => {
              changeHandler(boxName);
              dialogRef.current.close();
            }}
            disabled={lengthError}
          >
            Save changes
          </Button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default React.memo(BoxNameEditDialog);
