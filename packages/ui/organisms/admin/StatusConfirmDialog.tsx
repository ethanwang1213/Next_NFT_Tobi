import Image from "next/image";
import { MutableRefObject } from "react";

const StatusConfirmDialog = ({
  title,
  contents,
  colors,
  dialogRef,
}: {
  title: string;
  contents: string[];
  colors: string[];
  dialogRef: MutableRefObject<HTMLDialogElement>;
}) => {
  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-[425px] rounded-3xl pt-4 flex flex-col gap-6 relative">
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
        <div className="flex flex-col">
          <div className="text-error text-lg font-semibold">注意！</div>
          <div className="text-neutral-700 text-base font-bold">{title}</div>
        </div>
        <div className="flex flex-col gap-1">
          {contents.map((content, index) => (
            <div
              key={`content-${index}`}
              className="text-sm font-normal"
              style={{ color: `${colors[index]}` }}
            >
              {content}
            </div>
          ))}
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
            }}
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
