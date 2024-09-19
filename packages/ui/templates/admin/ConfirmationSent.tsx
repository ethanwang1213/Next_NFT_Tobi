import Image from "next/image";
import BackLink from "ui/organisms/admin/BackLink";
import { InfoLink } from "ui/templates/admin/FlowAgreementWithSnsAccount";

type Props = {
  onClickBack: () => void;
};

const ConfirmationSent = ({ onClickBack }: Props) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-[100dvh] p-8">
        <div className={"w-full"}>
          <BackLink hideText={true} onClickBack={onClickBack} />
        </div>
        <div className={"font-bold text-[40px]"}>
          Sent a confirmation email!
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
          Please check your mailbox.
          <br />
          Authentication will be completed by clicking the authentication link
          in the email.
        </div>
        <div className={"mt-[30px]"}>
          <InfoLink
            url={"https://www.tobiratory.com/about"}
            text={"Haven't received the email?"}
          />
        </div>
      </div>
    </>
  );
};

export default ConfirmationSent;
