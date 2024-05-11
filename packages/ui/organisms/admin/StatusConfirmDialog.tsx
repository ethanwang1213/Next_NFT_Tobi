import Image from "next/image";
import { MutableRefObject } from "react";

const StatusConfirmDialog = ({
  title,
  descriptions,
  notes,
  disabled,
  dialogRef,
  saveHandler,
}: {
  title: string;
  descriptions: string[];
  notes: string[];
  disabled: boolean;
  dialogRef: MutableRefObject<HTMLDialogElement>;
  saveHandler: () => void;
}) => {
  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-[425px] rounded-3xl pt-0 flex flex-col gap-6 relative">
        <form method="dialog">
          <button className="absolute w-4 h-4 top-7 right-6">
            <Image
              src="/admin/images/icon/close.svg"
              width={16}
              height={16}
              alt="close icon"
            />
          </button>
        </form>
        <div className="flex flex-col">
          <div className="text-error text-lg font-semibold">注意！</div>
          <div className="text-neutral-700 text-base font-bold">{title}</div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            {descriptions.map((content, index) => (
              <span
                key={`content-${index}`}
                className="text-sm font-normal text-neutral-700"
              >
                {content}
              </span>
            ))}
          </div>
          {notes.length > 0 && (
            <ul className="list-disc ml-6">
              {notes.map((content, index) => (
                <li
                  key={`content-${index}`}
                  className="text-sm font-normal text-error"
                >
                  {content}
                </li>
              ))}
            </ul>
          )}
          <div>
            {disabled ? (
              <span className="text-sm font-normal text-neutral-700">
                There are required fields that have not been filled. Please
                check.
              </span>
            ) : (
              <span className="text-sm font-normal text-neutral-700">
                Do you wish to continue?
              </span>
            )}
          </div>
        </div>
        <div className="modal-action flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 rounded-[64px] border-2 border-primary
              hover:shadow-xl hover:-top-[3px] transition-shadow
              text-primary text-sm leading-4 font-semibold"
            onClick={() => dialogRef.current.close()}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-primary rounded-[64px] 
              hover:shadow-xl hover:-top-[3px] transition-shadow
              text-base-white text-sm leading-4 font-semibold"
            onClick={() => {
              dialogRef.current.close();
              saveHandler();
            }}
            disabled={disabled}
          >
            Save changes
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default StatusConfirmDialog;
