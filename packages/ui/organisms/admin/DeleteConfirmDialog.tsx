import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { MutableRefObject } from "react";
import Button from "ui/atoms/Button";

const DeleteConfirmDialog = ({
  dialogRef,
  changeHandler,
}: {
  dialogRef: MutableRefObject<HTMLDialogElement>;
  changeHandler: (value: string) => void;
}) => {
  const t = useTranslations("GiftReceivingSettings");
  return (
    <dialog ref={dialogRef} className="modal">
      <div
        className={`modal-box max-w-[875px] rounded-3xl pt-4 flex flex-col gap-3 relative`}
      >
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
        <div className="text-error text-lg font-semibold">{t("Warning")}</div>
        <div className="text-neutral-700 text-sm font-normal mb-2">
          {t("DeleteBoxWarning")}
        </div>
        <div className="modal-action flex justify-end gap-4">
          <Button
            type="button"
            className="px-4 py-2 rounded-[64px] border-2 border-secondary
              text-secondary text-sm leading-4 font-semibold"
            onClick={() => {
              changeHandler("cancel");
              dialogRef.current.close();
            }}
          >
            {t("Cancel")}
          </Button>
          <Button
            type="button"
            className="px-4 py-2 bg-error rounded-[64px] 
              text-base-white text-sm leading-4 font-semibold"
            onClick={() => {
              changeHandler("delete");
              dialogRef.current.close();
            }}
          >
            {t("Delete")}
          </Button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default React.memo(DeleteConfirmDialog);
