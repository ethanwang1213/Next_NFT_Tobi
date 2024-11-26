import { useTranslations } from "next-intl";
import Image from "next/image";
import { MutableRefObject, useEffect, useState } from "react";

const ContentNameChangeNotice = ({
  initialValue,
  dialogRef,
}: {
  initialValue: string;
  dialogRef: MutableRefObject<HTMLDialogElement>;
}) => {
  const [contentName, setContentName] = useState("");
  const t = useTranslations("ContentSettings");
  const l = useTranslations("GiftReceivingSettings");

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
          {t("contentNameChangeRequest")
            .split("\n")
            .map((line, index) => (
              <>
                {line}
                <br />
              </>
            ))}
        </div>
        <div className="flex justify-between items-center gap-4 pl-[92px] pr-[80px]">
          <input
            type="text"
            disabled
            className="flex-1 rounded-[64px] border-[1px] border-neutral-200 py-2 pl-3 pr-12 outline-none
            text-base-black text-sm leading-4 font-normal bg-secondary-300"
            value={contentName}
          />
        </div>
        <div className="modal-action flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 bg-primary rounded-[64px] 
              hover:shadow-xl hover:-top-[3px] transition-shadow
              text-base-white text-sm leading-4 font-semibold"
            onClick={() => {
              dialogRef.current.close();
            }}
          >
            {t("GotIt")}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ContentNameChangeNotice;
