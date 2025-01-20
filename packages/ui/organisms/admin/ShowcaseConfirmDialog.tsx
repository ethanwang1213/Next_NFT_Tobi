import { useTranslations } from "next-intl";
import React, { MutableRefObject } from "react";
import Button from "ui/atoms/Button";

const ShowcaseConfirmDialog = ({
  dialogRef,
  deleteHandler,
}: {
  dialogRef: MutableRefObject<HTMLDialogElement>;
  deleteHandler: () => void;
}) => {
  const t = useTranslations("Showcase");
  const l = useTranslations("GiftReceivingSettings");
  return (
    <dialog ref={dialogRef} className="modal">
      <div
        className={`modal-box max-w-[875px] rounded-3xl p-6 flex flex-col relative`}
      >
        <div className="text-error text-[18px] font-bold">
          {t("DeleteShowcase")}
        </div>
        <div className="text-neutral-700 text-[16px] font-normal mt-4">
          {t("DeleteConfirmationMessage")} <br/>
          {t("ProceedConfirmation")}
        </div>
        <div className="modal-action mt-4 flex justify-end gap-1">
          <Button
            type="button"
            className="px-4 py-2 rounded-[64px] border-2 border-secondary
              text-secondary text-sm leading-4 font-semibold"
            onClick={() => {
              dialogRef.current.close();
            }}
          >
            {l("Cancel")}
          </Button>
          <Button
            type="button"
            className="px-4 py-2 bg-error rounded-[64px] 
              text-base-white text-sm leading-4 font-semibold"
            onClick={() => {
              deleteHandler();
              dialogRef.current.close();
            }}
          >
            {l("Delete")}
          </Button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default React.memo(ShowcaseConfirmDialog);
