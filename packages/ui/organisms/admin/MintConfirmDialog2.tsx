import Image from "next/image";
import React, { MutableRefObject } from "react";
import Button from "ui/atoms/Button";

const MintConfirmDialog2 = ({
  dialogRef,
  changeHandler,
}: {
  dialogRef: MutableRefObject<HTMLDialogElement>;
  changeHandler: (value: string) => void;
}) => {
  return (
    <dialog ref={dialogRef} className="modal">
      <div
        className={`modal-box max-w-[425px] rounded-3xl p-6 flex flex-col relative`}
      >
        <div className="text-base-black text-base font-bold">
          Are you sure you want to mint?
        </div>
        <div className="text-neutral-700 text-sm font-normal mt-4">
          Performing the Mint operation will disable the ability to undo
          <Image
            src="/admin/images/icon/undo.svg"
            width={16}
            height={16}
            alt="undo icon"
            className="inline"
          />
          or redo
          <Image
            src="/admin/images/icon/redo.svg"
            width={16}
            height={16}
            alt="redo icon"
            className="inline"
          />
          any previous changes.
          <br />
          Please confirm that you want to proceed.
        </div>
        <div className="text-neutral-700 text-sm font-normal mt-4">
          Do you wish to continue?
        </div>
        <div className="modal-action mt-4 flex justify-end gap-1">
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
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default React.memo(MintConfirmDialog2);
