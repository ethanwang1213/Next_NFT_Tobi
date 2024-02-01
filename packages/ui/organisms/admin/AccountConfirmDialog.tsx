import Image from "next/image";
import { MutableRefObject } from "react";

type AccountInfo = {
  name: string;
  email: string;
  avatarUrl?: string;
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
      <div className="modal-box w-[437px] rounded-[32px]">
        <div className="flex justify-end mr-[2px] mt-[-2px]">
          <form method={"dialog"}>
            <button className="btn w-[16px] h-[19px] min-h-fit border-0 p-0 bg-base-100 hover:bg-base-100">
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
        <div className="text-center text-2xl text-base-200-content font-normal">
          {title}
        </div>
        <Image
          src={
            account && account.avatarUrl
              ? account.avatarUrl
              : "/admin/images/icon/profile.svg"
          }
          alt={"profile image"}
          width={153}
          height={153}
          className={"m-auto mt-[30px]"}
        />
        <div className={"text-center mt-[30px] text-2xl text-base-200-content"}>
          {account && account.name ? account.name : "Account Name"}
        </div>
        <div
          className={
            "text-center text-[15px] text-base-200-content font-normal"
          }
        >
          {account && account.email ? account.email : "@account_name"}
        </div>
        <div className="modal-action justify-center mt-[70px] mb-[33px]">
          <form method="dialog">
            <div className={"flex flex-col justify-center space-y-[26px]"}>
              <button
                onClick={
                  firstButtonProp.callback ? firstButtonProp.callback : null
                }
                className={`btn w-[268px] h-[56px] rounded-[30px] text-xl font-semibold 
                ${
                  firstButtonProp.isPrimary
                    ? "bg-primary hover:bg-primary text-primary-content"
                    : "border-primary hover:border-primary text-primary bg-base-100 hover:bg-base-100"
                } 
                `}
              >
                {firstButtonProp.caption}
              </button>
              <button
                onClick={
                  secondButtonProp.callback ? secondButtonProp.callback : null
                }
                className={`btn w-[268px] h-[56px] rounded-[30px] text-xl font-semibold 
                ${
                  secondButtonProp.isPrimary
                    ? "bg-primary hover:bg-primary text-primary-content"
                    : "border-primary hover:border-primary text-primary bg-base-100 hover:bg-base-100"
                } 
                `}
              >
                {secondButtonProp.caption}
              </button>
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
