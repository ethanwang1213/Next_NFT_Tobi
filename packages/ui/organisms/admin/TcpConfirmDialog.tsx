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
  callback: () => void;
};

type LinkProp = {
  caption: string;
  callback: () => void;
};

const TcpConfirmDialog = ({
  title,
  account,
  linkProp,
  buttonProp,
  dialogRef,
}: {
  title: string;
  account: AccountInfo;
  linkProp: LinkProp;
  buttonProp: ButtonProp;
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
                height={16}
                className={"h-[16px] border-0 p-0"}
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
            <div className={"flex flex-col justify-center flex-1 gap-[24px]"}>
              <Button
                onClick={buttonProp.callback ? buttonProp.callback : null}
                className={`btn sm:w-[268px] sm:h-[56px] w-[170px] h-[35px] rounded-[30px] sm:text-xl text-[14px] font-semibold
                bg-primary hover:bg-primary text-primary-content`}
              >
                {buttonProp.caption}
              </Button>{" "}
              <button
                onClick={linkProp.callback}
                className={`btn btn-link sm:w-[268px] sm:h-[56px] w-[170px] h-[44px] text-[14px] font-normal no-underline`}
              >
                {linkProp.caption}
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

export default TcpConfirmDialog;
