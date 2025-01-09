import { useTranslations } from "next-intl";
import Button from "ui/atoms/Button";

const PasswordPromptDialog = ({
  isOpen,
  onClickCancel,
  onClickNext,
}: {
  isOpen: boolean;
  onClickCancel: () => void;
  onClickNext: () => void;
}) => {
  const t = useTranslations();

  const translatePrompt = () => {
    return t.rich("Account.PromptPassword", {
      color: (chunks) => <span className="text-error">{chunks}</span>,
      underline: (chunks) => <span className="underline">{chunks}</span>,
    });
  };

  return (
    <dialog open={isOpen} className="modal">
      <div
        className={`modal-box max-w-[524px] flex flex-col items-start rounded-[16px]
                    border-solid border-[#CFCECE] bg-base-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]`}
      >
        <div className="flex flex-col items-start gap-[6px] self-stretch">
          <div className="flex justify-center items-center">
            <div className="text-secondary text-[14px] font-bold leading-normal">
              {translatePrompt()}
            </div>
          </div>
        </div>
        <div className="flex h-[64px] pt-0 justify-end items-end gap-[16px] self-stretch">
          <Button
            className={`flex px-[16px] py-[8px] justify-center items-center
                        gap-[8px] rounded-[64px] border-[1px] border-solid border-primary`}
            onClick={onClickCancel}
          >
            <div className="text-primary text-[14px] font-medium leading-[120%]">
              {t("Label.Cancel")}
            </div>
          </Button>
          <Button
            className={`flex px-[16px] py-[8px] justify-center items-center gap-[8px]
                        rounded-[64px] bg-primary`}
            onClick={onClickNext}
          >
            <div className="text-base-white text-[14px] font-bold leading-[120%]">
              {t("Account.GoToSetPassword")}
            </div>
          </Button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClickCancel}>close</button>
      </form>
    </dialog>
  );
};

export default PasswordPromptDialog;
