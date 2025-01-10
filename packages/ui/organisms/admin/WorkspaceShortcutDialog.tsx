import { useTranslations } from "next-intl";
import Image from "next/image";
import { MutableRefObject } from "react";

interface ShortcutComponentProps {
  title: string;
  description: string;
  imageSrc: string;
}

const ShortcutComponent = ({
  title,
  description,
  imageSrc,
}: ShortcutComponentProps) => {
  return (
    <div
      className="ml-2 px-7 py-[6px] rounded-2xl
      flex justify-between items-center gap-2 cursor-pointer relative"
    >
      <div className="flex flex-col gap-1">
        <span className="text-neutral-700 text-sm font-bold leading-4">
          {title}
        </span>
        <span className="text-neutral-900 text-[12px] font-normal leading-4">
          {description}
        </span>
      </div>
      <Image
        width={80}
        height={60}
        src={imageSrc}
        alt="shortcut icon"
        className="rounded-lg transition-opacity"
      />
    </div>
  );
};

const WorkspaceShortcutDialog = ({
  dialogRef,
}: {
  dialogRef: MutableRefObject<HTMLDialogElement>;
}) => {
  const t = useTranslations("Showcase");

  const shortcuts = [
    {
      title: t("Movement.title"),
      description: t("Movement.description"),
      imageSrc: "/admin/images/png/movement.png",
    },
    {
      title: t("WheelScroll.title"),
      description: t("WheelScroll.description"),
      imageSrc: "/admin/images/png/mouseScroll.png",
    },
    {
      title: t("MouseWheelDrag.title"),
      description: t("MouseWheelDrag.description"),
      imageSrc: "/admin/images/png/mouseDrag.png",
    },
    {
      title: t("RightDrag.title"),
      description: t("RightDrag.description"),
      imageSrc: "/admin/images/png/rightDrag.png",
    },
    {
      title: t("UndoAction.title"),
      description: t("UndoAction.description"),
      imageSrc: "/admin/images/png/undoAction.png",
    },
    {
      title: t("RedoAction.title"),
      description: t("RedoAction.description"),
      imageSrc: "/admin/images/png/redoAction.png",
    },
    {
      title: t("Duplicate.title"),
      description: t("Duplicate.description"),
      imageSrc: "/admin/images/png/duplicate.png",
    },
    {
      title: t("RestoreItem.title"),
      description: t("RestoreItem.description"),
      imageSrc: "/admin/images/png/deleteKey.png",
    },
  ];

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box w-[478px] rounded-3xl p-4 pt-10 pb-6 relative">
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
        <div className="h-full flex flex-col gap-1">
          {shortcuts.map((shortcut, index) => (
            <ShortcutComponent
              key={index}
              title={shortcut.title}
              description={shortcut.description}
              imageSrc={shortcut.imageSrc}
            />
          ))}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default WorkspaceShortcutDialog;
