import Image from "next/image";
import { MutableRefObject } from "react";
import Button from "ui/atoms/Button";

type AccountInfo = {
  name: string;
  email: string;
  icon?: string;
};

type ButtonProp = {
  caption: string;
  isPrimary: boolean;
  callback?: () => void;
};
const AccountConfirmDialog = ({
  title,
  account,
  firstButtonProp,
  secondButtonProp,
  dialogRef,
}: {
  title: string;
  account: AccountInfo;
  firstButtonProp: ButtonProp;
  secondButtonProp: ButtonProp;
  dialogRef?: MutableRefObject<HTMLDialogElement>;
}) => {
  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box sm:w-[437px] w-[280px] rounded-[32px]">
        <div className="flex justify-end mr-[2px] mt-[-2px]">
          <form method={"dialog"}>
            <button className="btn sm:w-[16px] sm:h-[19px] w-[10px] h-[10px] min-h-fit border-0 p-0 bg-base-100 hover:bg-base-100">
              <Image
                src={"/admin/images/icon/close.svg"}
                alt={"close button"}
                width={16}
                height={19}
                className={"border-0 p-0"}
              />
            </button>
          </form>
        </div>
        <div className="text-center sm:text-2xl text-[14px] text-base-200-content font-bold mt-6">
          {title}
        </div>
        <Image
          src={account.icon || "/admin/images/icon/profile.svg"}
          alt={"profile image"}
          width={153}
          height={153}
          className={
            "m-auto mt-[30px] md:w-[153px] md:h-[153px] w-[65px] h-[65px]"
          }
        />
        <div
          className={
            "text-center sm:mt-[30px] mt-4 sm:text-2xl text-[20px] text-base-200-content"
          }
        >
          {account.name || "Account Name"}
        </div>
        <div
          className={
            "text-center text-[15px] text-base-200-content font-normal mt-4"
          }
        >
          {account.email || "@account_name"}
        </div>
        <div className="modal-action justify-center sm:mt-[70px] mt-[24px] sm:mb-[33px]">
          <form method="dialog">
            <div className={"flex flex-col justify-center space-y-[26px]"}>
              <Button
                onClick={
                  firstButtonProp.callback ? firstButtonProp.callback : null
                }
                className={`btn sm:w-[268px] sm:h-[56px] w-[170px] h-[35px] rounded-[30px] sm:text-xl text-[13px] font-semibold 
                ${
                  firstButtonProp.isPrimary
                    ? "bg-primary hover:bg-primary text-primary-content"
                    : "border-primary hover:border-primary text-primary bg-base-100 hover:bg-base-100"
                } 
                `}
              >
                {firstButtonProp.caption}
              </Button>
              <Button
                onClick={
                  secondButtonProp.callback ? secondButtonProp.callback : null
                }
                className={`btn sm:w-[268px] sm:h-[56px] w-[170px] h-[35px] rounded-[30px] sm:text-xl text-[13px] font-semibold 
                ${
                  secondButtonProp.isPrimary
                    ? "bg-primary hover:bg-primary text-primary-content"
                    : "border-primary hover:border-primary text-primary bg-base-100 hover:bg-base-100"
                } 
                `}
              >
                {secondButtonProp.caption}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default AccountConfirmDialog;
