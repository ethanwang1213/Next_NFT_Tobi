import { useTranslations } from "next-intl";
import React, { MutableRefObject } from "react";
import Button from "ui/atoms/Button";

const MintConfirmDialog2 = ({
  dialogRef,
  changeHandler,
}: {
  dialogRef: MutableRefObject<HTMLDialogElement>;
  changeHandler: (value: string) => void;
}) => {
  const t = useTranslations("Showcase");
  return (
    <dialog ref={dialogRef} className="modal">
      <div
        className={`modal-box max-w-[425px] rounded-3xl p-6 flex flex-col relative`}
      >
        <div className="text-base-black text-base font-bold">
          {t("ConfirmMint")}
        </div>
        <div className="text-neutral-700 text-sm font-normal mt-4">
          After minting, the status will change to Private and cannot be
          reverted to Draft.
        </div>
        <div className="text-neutral-700 text-sm font-normal mt-4">
          {t("WishToContinue")}
        </div>
        <div className="modal-action mt-4 flex justify-end gap-1">
          <Button
            type="button"
            className="px-4 py-2 rounded-[64px] border-2 border-primary
              text-primary text-sm leading-4 font-semibold"
            onClick={() => {
              changeHandler("cancel");
              dialogRef.current.close();
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="px-4 py-2 bg-primary rounded-[64px] 
              text-base-white text-sm leading-4 font-semibold"
            onClick={() => {
              changeHandler("mint");
              dialogRef.current.close();
            }}
          >
            Mint Now
          </Button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default React.memo(MintConfirmDialog2);
