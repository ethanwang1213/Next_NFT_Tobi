import { useSettingContext } from "@/contexts/journal-SettingProvider";
import Image from "next/image";

/**
 * Inform the user that an email has been successfully added.
 * @returns
 */
const RedeemEmailAddedModal: React.FC = () => {
  const { closeRedeemEmailAddedModal, isOpenRedeemEmailAddedModal } =
    useSettingContext();
  return (
    <dialog
      id="redeem-email-added-modal"
      className="modal backdrop-blur-[16.35px]"
      open={isOpenRedeemEmailAddedModal}
    >
      <div className="modal-box inline-flex px-0 pt-[61px] pb-[40px] flex-col justify-end items-center gap-[77px] rounded-[32px] bg-neutral min-w-[512px] min-h-[585px]">
        <form method="dialog">
          <div className="w-[496px] h-[366px]">
            <div className="w-[496px] h-[80px] shrink-0">
              <div className="flex w-[496px] h-[80px] min-h-[80px] flex-col justify-center shrink-0 text-neutral-main text-center text-[32px] font-bold leading-normal">
                Added
                <br />
                New Redemption address
              </div>
            </div>
            <div className="inline-flex w-[496px] h-[230px] items-center shrink-0 mt-[50px]">
              <div className="w-[496px] h-[230px]">
                <div className="w-[496px] h-[230px] shrink-0 flex justify-center items-center relative">
                  <Image
                    src="/journal/images/icon/Journalbook_journal.svg"
                    alt="Journal Book"
                    fill={true}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-action w-[496px] h-[48px] mt-[70px] flex justify-center">
            <button
              onClick={closeRedeemEmailAddedModal}
              className="btn bg-primary-main w-[176px] h-[48px] rounded-[32px] text-neutral hover:bg-primary-main hover:text-neutral shadow-[0_5px_5.4px_0_rgba(0,0,0,0.25)]"
            >
              <div className="flex w-[176px] h-[48px] flex-col justify-center shrink-0 text-neutral text-[20px] font-bold leading-normal">
                Done
              </div>
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={closeRedeemEmailAddedModal}>close</button>
      </form>
    </dialog>
  );
};

export default RedeemEmailAddedModal;
