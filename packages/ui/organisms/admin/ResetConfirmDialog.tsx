import { useTranslations } from "next-intl";
import React, { MutableRefObject } from "react";
import Button from "ui/atoms/Button";

const ResetConfirmDialog = ({
  dialogRef,
  confirmHandler,
}: {
  dialogRef: MutableRefObject<HTMLDialogElement>;
  confirmHandler: () => void;
}) => {
  const t = useTranslations("Workspace");
  return (
    <dialog ref={dialogRef} className="modal">
      <div
        className={`modal-box max-w-[425px] rounded-3xl pt-6 flex flex-col relative`}
      >
        <div className="text-base-black text-base font-bold mb-6">
          {t("ConfirmResetSettings")}
        </div>
        <div className="modal-action flex justify-end gap-1 mt-1">
          <Button
            type="button"
            className="px-4 py-2 rounded-[64px] border-2 border-gray-500
              text-gray-500 text-base leading-4 font-semibold"
            onClick={() => {
              dialogRef.current.close();
            }}
          >
            {t("Cancel")}
          </Button>
          <Button
            type="button"
            className="px-4 py-2 bg-primary rounded-[64px] 
              text-base-white text-base leading-4 font-semibold first-letter:uppercase"
            onClick={() => {
              confirmHandler();
              dialogRef.current.close();
            }}
          >
            {t("Reset")}
          </Button>
        </div>
      </div>
    </dialog>
  );
};

export default React.memo(ResetConfirmDialog);
