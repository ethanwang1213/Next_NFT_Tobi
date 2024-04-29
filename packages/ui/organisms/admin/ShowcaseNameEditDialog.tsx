import Image from "next/image";
import { MutableRefObject, useState } from "react";

const ShowcaseNameEditDialog = ({
  initialValue,
  dialogRef,
  changeHandler,
}: {
  initialValue: string;
  dialogRef: MutableRefObject<HTMLDialogElement>;
  changeHandler: (value: string) => void;
}) => {
  const [showcaseName, setShowcaseName] = useState(initialValue);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-[875px] rounded-3xl pt-7 flex flex-col gap-3 relative">
        <form method="dialog">
          <button className="absolute w-4 h-4 top-3 right-3">
            <Image
              src="/admin/images/icon/close2.svg"
              width={16}
              height={16}
              alt="close icon"
            />
          </button>
        </form>
        <div className="flex justify-between items-center gap-4">
          <span className="text-base-black text-sm font-semibold">
            Showcase Name
          </span>
          <input
            type="text"
            className="flex-1 rounded-[64px] border-[1px] border-neutral-200 py-2 pl-3 pr-12 outline-none
            text-base-black text-sm leading-4 font-normal"
            value={showcaseName}
            onChange={(e) => setShowcaseName(e.target.value)}
          />
        </div>
        <div className="modal-action flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 bg-primary rounded-[64px] 
              text-base-white text-sm leading-4 font-semibold"
            onClick={() => {
              dialogRef.current.close();
              changeHandler(showcaseName);
            }}
          >
            Save changes
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-base-white rounded-[64px] border-2 border-primary
              text-primary text-sm leading-4 font-semibold"
            onClick={() => dialogRef.current.close()}
          >
            Cancel
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ShowcaseNameEditDialog;
