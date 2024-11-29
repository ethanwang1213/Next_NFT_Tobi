import { useTranslations } from "next-intl";
import Image from "next/image";
import BackLink from "ui/molecules/BackLink";

type Props = {
  onClickBack: () => void;
};

const ConfirmationSent = ({ onClickBack }: Props) => {
  const t = useTranslations("LogInSignUp");
  return (
    <>
      <div className="flex flex-col items-center justify-center h-[100dvh] p-8">
        <div className={"w-full"}>
          <BackLink hideText={true} onClickBack={onClickBack} />
        </div>
        <div className={"font-bold text-[40px]"}>
          {t("ConfirmationEmailSent")}
        </div>
        <Image
          src={"/admin/images/mail.svg"}
          alt={"sent mail"}
          width={329}
          height={282}
          className={"mt-[100px]"}
        />
        <div
          className={
            "w-[463px] mt-[50px] font-medium text-[20px] text-base-content text-center"
          }
        >
          {t("CheckEmail")}
          <br />
          {t("CheckText")}
        </div>
      </div>
    </>
  );
};

export default ConfirmationSent;
