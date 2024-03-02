import Image from "next/image";
import { useRef, useState } from "react";
import { User } from "types/adminTypes";
import Button from "ui/atoms/Button";

type Props = {
  user: User;
  onClickRegister: () => void;
};

const FlowAgreementWithSnsAccount = ({ user, onClickRegister }: Props) => {
  const aboutLinkToFlowAccount = useRef<HTMLDialogElement>(null);
  const termsDialogRef = useRef<HTMLDialogElement>(null);
  const [agreed, setAgreed] = useState(false);
  const buttonColor = () => {
    if (agreed) {
      return "bg-primary text-primary-content";
    } else {
      return "bg-inactive text-inactive-content";
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center w-[100dvw] h-[100dvh] p-8">
        <Image
          src={"/admin/images/tobiratory-flow.svg"}
          alt={"link tobiratory account with flow account"}
          width={313}
          height={114}
        />
        <div className={"text-[32px]"}>デジタルアイテムを所有するために</div>
        <div>ご登録のメールアドレスで、Flowアカウントを作成します。</div>
        <input
          type={"text"}
          placeholder={user?.email}
          disabled={true}
          className={
            "rounded-2xl bg-slate-100 w-[408px] h-[52px] placeholder:text-center input-bordered"
          }
        />
        <a
          href={"https://www.tobiratory.com/about"}
          className={"text-primary underline"}
          target="_blank"
          rel="noreferrer"
        >
          <div className={"flex flex-row items-baseline"}>
            <div
              className={"w-[12px] h-[12px] bg-primary"}
              style={{
                WebkitMaskImage: "url(/admin/images/info-icon.svg)",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                WebkitMaskSize: "contain",
              }}
            ></div>
            <div>Flowアカウントと連携するとできること</div>
          </div>
        </a>
        <div>
          <input
            type={"checkbox"}
            checked={agreed}
            onChange={() => setAgreed((prev) => !prev)}
          />
          <a
            href={"https://www.tobiratory.com/about"}
            className={"text-primary underline"}
            target="_blank"
            rel="noreferrer"
          >
            利用規約
          </a>
          に同意してトビラトリーアカウント、Flowアカウントを作成する。
        </div>
        <Button
          className={`${buttonColor()} w-[179px] h-[48px] rounded-2xl`}
          disabled={!agreed}
          onClick={onClickRegister}
        >
          登録
        </Button>
      </div>
    </>
  );
};

export default FlowAgreementWithSnsAccount;
