import { auth } from "fetchers/firebase/client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { User } from "types/adminTypes";
import Button from "ui/atoms/Button";
import BackLInk from "ui/molecules/BackLink";
import { TermsOfService } from "./FlowAgreementWithEmailAndPassword";

type Props = {
  user: User;
  onClickRegister: () => void;
};

const FlowAgreementWithSnsAccount = ({ user, onClickRegister }: Props) => {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const t = useTranslations("LogInSignUp");
  const buttonColor = () => {
    if (agreed) {
      return "bg-primary text-primary-content";
    } else {
      return "bg-inactive text-inactive-content";
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center p-8">
        <div className={"w-full"}>
          <BackLInk onClickBack={() => auth.signOut()} />
        </div>
        <Image
          src={"/admin/images/tobiratory-flow.svg"}
          alt={"link tobiratory account with flow account"}
          width={313}
          height={114}
        />
        <div className={"font-bold text-[32px] mt-[50px]"}>
          {t("DigitalItemsInfo")}
        </div>
        <div className={"font-medium text-[16px] mt-[100px]"}>
          {t("CreateFlowAccount")}
        </div>
        <input
          type={"text"}
          placeholder={user?.email}
          disabled={true}
          className={
            "rounded-lg bg-slate-100 w-[408px] h-[52px] mt-[10px] px-[15px] placeholder:text-center input-bordered shadow-[inset_0_2px_4px_0_rgb(0,0,0,0.3)]"
          }
        />
        <div className={"mt-[10px]"}>
          <LoginWithAnotherAccount />
        </div>
        <div className={"mt-[100px]"}>
          <TermsOfService
            visible={true}
            agreed={agreed}
            setAgreed={setAgreed}
          />
        </div>
        <Button
          className={`${buttonColor()} w-[179px] h-[48px] rounded-2xl mt-[20px]`}
          disabled={!agreed}
          onClick={onClickRegister}
        >
          <span className={"font-normal text-[20px]"}>{t("Register")}</span>
        </Button>
      </div>
    </>
  );
};

export const LoginWithAnotherAccount = () => {
  const t = useTranslations("LogInSignUp");
  return (
    <button className="btn btn-link" onClick={() => auth.signOut()}>
      <span className="text-primary text-center text-[12px] font-semibold">
        {t("LoginWithAnotherAccount")}
      </span>
    </button>
  );
};

export const InfoLink = ({ url, text }: { url: string; text: string }) => {
  return (
    <a
      href={url}
      className={"text-primary underline"}
      target="_blank"
      rel="noreferrer"
    >
      <div className={"flex flex-row items-center"}>
        <div
          className={"w-[32px] h-[32px] bg-primary"}
          style={{
            WebkitMaskImage: "url(/admin/images/info-icon.svg)",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            WebkitMaskSize: "contain",
          }}
        ></div>
        <div className={"font-medium text-[20px] ml-[5px] pb-[2px]"}>
          {text}
        </div>
      </div>
    </a>
  );
};

export default FlowAgreementWithSnsAccount;
