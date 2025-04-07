import { useTranslations } from "next-intl";
import Image from "next/image";
import { MutableRefObject, useEffect, useState } from "react";

const ContentNameEditDialog = ({
  initialValue,
  dialogRef,
  changeHandler,
}: {
  initialValue: string;
  dialogRef: MutableRefObject<HTMLDialogElement>;
  changeHandler: (value: string) => void;
}) => {
  const [contentName, setContentName] = useState("");
  const t = useTranslations("ContentSettings");
  const l = useTranslations("GiftReceivingSettings");
  const contentNameChange = (e) => {
    e.preventDefault();
    if (e.target.value.length < 30) {
      setContentName(e.target.value);
    }
  };
  useEffect(() => {
    setContentName(initialValue);
  }, [initialValue]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-[875px] rounded-3xl pt-4 flex flex-col gap-3 relative">
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
        <div className="text-neutral-700 text-sm font-normal mb-2">
          {t("ContentNameChangeGuidelines")}
        </div>
        <div className="flex justify-between items-center gap-4">
          <span className="text-base-black text-sm font-semibold">
            {t("ContentName")}
          </span>
          <div className="flex-1 relative">
            <input
              type="text"
              className="w-full rounded-[64px] border-[1px] border-neutral-200 py-2 pl-3 pr-12 outline-none
            text-base-black text-sm leading-4 font-normal"
              value={contentName}
              onChange={(e) => contentNameChange(e)}
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none text-[13px] hidden md:inline-block">
              <span className={"text-[#FF811C]"}>{contentName}</span> | 30
            </span>
          </div>
        </div>
        <div className="modal-action flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 rounded-[64px] border-2 border-primary
              hover:shadow-xl hover:-top-[3px] transition-shadow
              text-primary text-sm leading-4 font-semibold"
            onClick={() => dialogRef.current.close()}
          >
            {l("Cancel")}
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-primary rounded-[64px] 
              hover:shadow-xl hover:-top-[3px] transition-shadow
              text-base-white text-sm leading-4 font-semibold disabled:bg-neutral-300 disabled:cursor-not-allowed"
            onClick={() => {
              changeHandler(contentName);
              dialogRef.current.close();
            }}
            disabled={!contentName.trim()}
          >
            {l("SaveChanges")}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ContentNameEditDialog;
