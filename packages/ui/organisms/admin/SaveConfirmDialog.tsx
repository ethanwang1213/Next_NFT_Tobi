import { useTranslations } from "next-intl";
import Image from "next/image";
import { MutableRefObject } from "react";
import Button from "ui/atoms/Button";

const SaveConfirmDialog = ({
  dialogRef,
  changeHandler,
}: {
  dialogRef: MutableRefObject<HTMLDialogElement>;
  changeHandler: (value: string) => void;
}) => {
  const t = useTranslations("ContentSettings");
  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-[450px] rounded-3xl pt-4 flex flex-col gap-3 relative">
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
        <div className="text-neutral-700 text-[16px] font-bold mb-2">
          {t("DiscardChanges")}
        </div>
        <div className="modal-action flex justify-end gap-4">
          <Button
            type="button"
            className="px-4 py-2 bg-primary rounded-[64px] 
              text-base-white text-sm leading-4 font-semibold"
            onClick={() => {
              changeHandler("cancel");
              dialogRef.current.close();
            }}
          >
            {t("Cancel")}
          </Button>
          <Button
            type="button"
            className="px-4 py-2 rounded-[64px] border-2 border-primary
              text-primary text-sm leading-4 font-semibold"
            onClick={() => {
              changeHandler("discard");
              dialogRef.current.close();
            }}
          >
            {t("Discard")}
          </Button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default SaveConfirmDialog;
