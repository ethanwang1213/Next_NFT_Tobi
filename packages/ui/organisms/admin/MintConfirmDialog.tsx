import Image from "next/image";
import React, { MutableRefObject } from "react";
import Button from "ui/atoms/Button";

const MintConfirmDialog = ({
  dialogRef,
  changeHandler,
}: {
  dialogRef: MutableRefObject<HTMLDialogElement>;
  changeHandler: (value: string) => void;
}) => {
  return (
    <dialog ref={dialogRef} className="modal">
      <div
        className={`modal-box max-w-[425px] rounded-3xl pt-6 flex flex-col relative`}
      >
        <div className="text-base-black text-base font-bold">
          Are you sure you want to mint?
        </div>
        <div className="text-neutral-700 text-sm font-normal mt-5">
          Performing the Mint operation will disable the ability to undo
          <Image
            width={20}
            height={20}
            alt="undo button"
            src="/admin/images/icon/undo.svg"
            className="cursor-pointer inline"
          />
          or redo
          <Image
            width={20}
            height={20}
            alt="redo button"
            src="/admin/images/icon/redo.svg" // Ensure you have the correct path for the redo icon
            className="cursor-pointer inline"
          />
          any previous changes. Please confirm that you want to proceed.
        </div>
        <div className="text-neutral-700 text-sm font-normal mt-2 mb-1">
          Do you wish to continue?
        </div>
        <div className="modal-action flex justify-end gap-1 mt-1">
          <Button
            type="button"
            className="px-4 py-2 rounded-[64px] border-2 border-primary
              text-primary text-sm leading-4 font-semibold"
            onClick={() => {
              changeHandler("cancel");
              dialogRef.current.close();
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="px-4 py-2 bg-primary rounded-[64px] 
              text-base-white text-sm leading-4 font-semibold"
            onClick={() => {
              changeHandler("mint");
              dialogRef.current.close();
            }}
          >
            Mint Now
          </Button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default React.memo(MintConfirmDialog);
