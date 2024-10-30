import { useTranslations } from "next-intl";
import Image from "next/image";
import { MutableRefObject } from "react";

const ContentNameConfirmDialog = ({
  dialogRef,
}: {
  dialogRef: MutableRefObject<HTMLDialogElement>;
}) => {
  const t = useTranslations("ContentSettings");
  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-[400px] rounded-3xl pt-4 flex flex-col gap-3 relative">
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
        <div className="text-base-black text-lg font-semibold">
          {t("ContentNameChange")}
        </div>
        <div className="flex justify-center my-4">
          <Image
            src="/admin/images/tobiratory-logo-gray.svg"
            width={74}
            height={79}
            alt="log image"
          />
        </div>
        <div className="text-base-black text-lg leading-[21px] font-semibold">
          {t("NameChangeRequest")}
        </div>
        <div className="text-neutral-700 text-sm leading-[17px] font-normal mb-2">
          {t("NameChangeCompletion")}
        </div>
        <div className="modal-action flex justify-end -mt-4">
          <button
            type="button"
            className="px-4 py-2 bg-primary rounded-[64px]
              text-base-white text-sm leading-4 font-semibold"
            onClick={() => dialogRef.current.close()}
          >
            {t("Done")}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ContentNameConfirmDialog;
