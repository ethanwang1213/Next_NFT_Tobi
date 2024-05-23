import Image from "next/image";
import { MutableRefObject } from "react";

const SampleDetailDialog = ({
  thumbnail,
  content,
  item,
  dialogRef,
}: {
  thumbnail: string;
  content: string;
  item: string;
  dialogRef: MutableRefObject<HTMLDialogElement>;
}) => {
  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-[878px] rounded-3xl p-6 flex flex-col gap-3 justify-between items-center bg-opacity-90 bg-gray-800">
        <form method="dialog">
          <button className="absolute w-4 h-4 top-3 right-3">
            <Image
              src={"/admin/images/icon/close2.svg"}
              width={16}
              height={16}
              alt="close icon"
              style={{
                filter:
                  "opacity(0.7) brightness(0) saturate(100%) invert(100%)",
              }}
            />
          </button>
        </form>
        <span className="text-base-black text-base font-semibold text-gray-100">
          {content}
        </span>
        <span className="text-base-black text-2xl font-bold text-gray-100">
          {item ? item : "Unnamed Sample Item"}
        </span>
        <div className="mb-[56px]">
          <Image
            src={
              thumbnail == undefined
                ? "/admin/images/png/empty-image.png"
                : thumbnail
            }
            width={400}
            height={400}
            alt="Thumbnail Image"
          />
        </div>
      </div>
    </dialog>
  );
};

export default SampleDetailDialog;
