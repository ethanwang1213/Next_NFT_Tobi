import { useSettingContext } from "@/contexts/journal-SettingProvider";
import Image from "next/image";

/**
 * Inform the user that an email has been successfully sent.
 * @returns
 */
const EmailSentModal: React.FC = () => {
  const { closeEmailSentModal, isOpenEmailSentModal } = useSettingContext();
  return (
    <dialog
      id="email-sent-modal"
      className="modal backdrop-blur-[16.35px]"
      open={isOpenEmailSentModal}
    >
      <div className="modal-box w-[496px] h-[592px] shrink-0 rounded-[32px] bg-neutral">
        <form method="dialog">
          <div className="flex w-[432px] h-[80px] items-center shrink-0">
            <div className="flex w-[432px] h-[80px] flex-col justify-center shrink-0 text-neutral-main text-center text-[24px] font-bold leading-normal">
              Sent a confirmation email!
            </div>
            <button
              onClick={closeEmailSentModal}
              className="btn btn-sm btn-circle btn-ghost absolute right-[32px]"
            >
              <Image
                src="/journal/images/icon/close.svg"
                alt="Close"
                width={32}
                height={32}
              />
            </button>
          </div>
          <div className="flex w-[432px] h-[137px] shrink-0 justify-center">
            <Image
              src="/journal/images/login/mail.svg"
              alt="Mail"
              width={137}
              height={137}
            />
          </div>
          <div className="w-[432px] h-[86px] shrink-0 mt-[47px]">
            <div className="text-neutral-main text-center text-[16px] font-bold leading-normal">
              Please check your mailbox.
              <br />
              Authentication will be completed by clicking the authentication
              link in the email.
            </div>
          </div>
          <div className="flex w-[432px] h-[32px] shrink-0 justify-center items-center">
            <div
              className="w-[24px] h-[24px] bg-info"
              style={{
                WebkitMaskImage: `url(/journal/images/icon/info-icon.svg)`,
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                WebkitMaskSize: "contain",
              }}
            ></div>
            <div className="flex w-[294px] h-[32px] justify-center">
              <div className="text-secondary-main text-center text-[20px] font-normal leading-normal underline">
                <a
                  href="https://www.tobiratory.com/about"
                  target="_blank"
                  rel="noreferrer"
                >
                  Haven&apos;t received the email?
                </a>
              </div>
            </div>
          </div>
          <div className="modal-action w-[432px] h-[48px] mt-[43px] flex justify-center">
            <button
              onClick={closeEmailSentModal}
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
        <button onClick={closeEmailSentModal}>close</button>
      </form>
    </dialog>
  );
};

export default EmailSentModal;
