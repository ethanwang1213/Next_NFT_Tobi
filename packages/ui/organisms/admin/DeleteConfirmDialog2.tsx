import React, { MutableRefObject } from "react";
import Button from "ui/atoms/Button";

const DeleteConfirmDialog2 = ({
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
          Are you sure you want to delete?
        </div>
        <div className="text-neutral-700 text-sm font-normal mt-4">
          Performing the Delete operation will disable the ability to undo or
          redo any previous changes. Please confirm that you want to proceed.
        </div>
        <div className="text-neutral-700 text-sm font-normal mt-4">
          Do you wish to continue?
        </div>
        <div className="modal-action mt-4 flex justify-end gap-1">
          <Button
            type="button"
            className="w-[80px] text-center py-2 rounded-[64px] border-2 border-secondary
              text-secondary text-sm leading-4 font-semibold"
            onClick={() => {
              changeHandler("cancel");
              dialogRef.current.close();
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="w-[80px] text-center py-2 bg-error-300 rounded-[64px] 
              text-base-white text-sm leading-4 font-semibold"
            onClick={() => {
              changeHandler("delete");
              dialogRef.current.close();
            }}
          >
            Delete
          </Button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default React.memo(DeleteConfirmDialog2);
