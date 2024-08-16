import { useSettingContext } from "@/contexts/journal-SettingProvider";
import Image from "next/image";

/**
 * A modal to confirm the deletion of an email address.
 * @returns
 */
const ConfirmEmailRemovalModal: React.FC = () => {
  const {
    closeConfirmEmailRemovalModal,
    isOpenConfirmEmailRemovalModal,
    removeRedeemEmail,
  } = useSettingContext();
  return (
    <dialog
      id="confirm-email-removal-modal"
      className="modal backdrop-blur-[16.35px]"
      open={isOpenConfirmEmailRemovalModal}
    >
      <div className="modal-box w-[496px] h-[310px] shrink-0 inline-flex px-0 py-[32px] flex-col items-start gap-[10px] rounded-[32px] bg-neutral">
        <form method="dialog" className="flex flex-col items-center gap-[16px]">
          <button
            onClick={closeConfirmEmailRemovalModal}
            className="btn btn-sm btn-circle btn-ghost absolute right-[32px]"
          >
            <Image
              src="/journal/images/icon/close.svg"
              alt="Close"
              width={32}
              height={32}
            />
          </button>
          <div className="w-[496px] h-[80px]">
            <div className="flex w-[496px] h-[80px] flex-col justify-center shrink-0">
              <span className="text-center text-neutral-main text-[24px] font-bold leading-normal">
                Remove Address
              </span>
            </div>
          </div>
          <div className="w-[463px] h-[86px] text-neutral-main text-center text-[16px] font-bold leading-normal">
            Are you sure you want to remove this address?
            <br />
            This action cannot be undone.
          </div>
          <div className="modal-action flex items-start gap-[16px] mt-0">
            <button
              onClick={closeConfirmEmailRemovalModal}
              className="btn btn-outline bg-neutral w-[176px] h-[48px] border-[3px] rounded-[32px] text-primary-main hover:border-primary-main hover:bg-neutral hover:text-primary-main shadow-[0_5px_5.4px_0_rgba(0,0,0,0.25)]"
            >
              <div className="flex w-[176px] h-[42px] flex-col justify-center shrink-0 text-primary-main text-center text-[20px] font-bold leading-normal">
                Cancel
              </div>
            </button>
            <button
              onClick={removeRedeemEmail}
              className="btn bg-active w-[176px] h-[48px] rounded-[32px] text-primary-main hover:bg-active hover:text-primary-main shadow-[0_5px_5.4px_0_rgba(0,0,0,0.25)]"
            >
              <div className="flex w-[176px] h-[48px] flex-col justify-center shrink-0 text-neutral text-[20px] font-bold leading-normal">
                Remove
              </div>
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={closeConfirmEmailRemovalModal}>close</button>
      </form>
    </dialog>
  );
};

export default ConfirmEmailRemovalModal;
