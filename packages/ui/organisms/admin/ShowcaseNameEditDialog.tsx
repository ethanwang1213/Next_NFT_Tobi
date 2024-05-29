import Image from "next/image";
import { MutableRefObject, useEffect, useState } from "react";

const ShowcaseNameEditDialog = ({
  showcaseTitle,
  showcaseDescription,
  dialogRef,
  changeHandler,
}: {
  showcaseTitle: string;
  showcaseDescription: string;
  dialogRef: MutableRefObject<HTMLDialogElement>;
  changeHandler: (title: string, description: string) => void;
}) => {
  const [title, setTitle] = useState(showcaseTitle);
  const [description, setDescription] = useState(showcaseDescription);

  useEffect(() => {
    setTitle(showcaseTitle);
  }, [showcaseTitle]);

  useEffect(() => {
    setDescription(showcaseDescription);
  }, [showcaseDescription]);

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
        <div className="flex justify-between items-center gap-4 mb-[20px]">
          <span className="text-base-black text-sm font-semibold w-[159px] text-right">
            Showcase Name
          </span>
          <input
            type="text"
            className="flex-1 rounded-[64px] border-[1px] border-neutral-200 py-2 pl-3 pr-12 outline-none
            text-base-black text-sm leading-4 font-normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center gap-4">
          <span className="text-base-black text-sm font-semibold w-[159px] text-right">
            Showcase Description
          </span>
          <textarea
            className="flex-1 rounded-[16px] border-[1px] border-neutral-200 py-2 pl-3 pr-12 outline-none
            text-base-black text-sm leading-4 font-normal resize-none h-[95px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
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
              changeHandler(title, description);
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

export default ShowcaseNameEditDialog;
