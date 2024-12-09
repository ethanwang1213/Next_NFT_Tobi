import { useTranslations } from "next-intl";
import Image from "next/image";
import { MutableRefObject, useState } from "react";

const ShortcutComponent = () => {
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const t = useTranslations("Showcase");

  return (
    <div
      className="ml-2 pl-4 pr-4 py-3 rounded-2xl
      flex justify-between items-center gap-2 cursor-pointer relative"
    >
      <div className="flex flex-col gap-1">
        <span className="text-neutral-900 text-sm font-semibold leading-4">
          {t("ShortCut")}
        </span>
        <span className="text-neutral-900 text-sm font-normal leading-4">
          {t("ReusableComponents")}
        </span>
      </div>
      <Image
        width={56}
        height={56}
        src="/admin/images/png/empty-image.png"
        alt="sample type icon"
        className="rounded-lg transition-opacity"
        style={{ opacity: showDeleteButton ? 0.25 : 1 }}
        onClick={() => setShowDeleteButton(true)}
      />
      {showDeleteButton && (
        <Image
          width={17}
          height={17}
          src="/admin/images/icon/do-not-disturb.svg"
          alt="delete icon"
          className="absolute right-2 bottom-2"
          onClick={() => setShowDeleteButton(false)}
        />
      )}
    </div>
  );
};

const WorkspaceShortcutDialog = ({
  dialogRef,
  changeHandler,
}: {
  dialogRef: MutableRefObject<HTMLDialogElement>;
  changeHandler: (value: string) => void;
}) => {
  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box w-[440px] rounded-3xl p-4 pt-10 pb-6 relative">
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
        <div
          className="h-[440px] flex flex-col gap-1 overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <ShortcutComponent />
          <ShortcutComponent />
          <ShortcutComponent />
          <ShortcutComponent />
          <ShortcutComponent />
          <ShortcutComponent />
          <ShortcutComponent />
          <ShortcutComponent />
          <ShortcutComponent />
          <ShortcutComponent />
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default WorkspaceShortcutDialog;
