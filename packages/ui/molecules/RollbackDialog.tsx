import Image from "next/image";

type RollbackDialogProps = {
  dialogRef: React.RefObject<HTMLDialogElement>;
};

export const RollbackDialog = ({ dialogRef }: RollbackDialogProps) => {
  return (
    <dialog ref={dialogRef} className="modal">
      <div
        className={`modal-box max-w-[425px] rounded-3xl p-6 flex flex-col relative`}
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
        <div className="text-base-black text-base font-bold">
          {"アイテムがロールバックされました"}
        </div>
        <div className="text-neutral-700 text-sm font-normal mt-4">
          {"保存に失敗したため、1つのアイテムの配置が元に戻されました。"}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};
