import Image from "next/image";
import BackLinkBlock from "../../molecules/BackLinkBlock";

type Props = {
  title: string;
  fontSize: "tiny" | "small" | "medium";
  onClickBack: () => void;
};

const ConfirmationSent = ({ title, fontSize, onClickBack }: Props) => {
  return (
    <>
      <div className="w-full">
        <BackLinkBlock
          title={title}
          visible={true}
          fontSize={fontSize}
          onClickBack={onClickBack}
        />
      </div>
      <Image
        src={"/journal/images/login/mail.svg"}
        alt={"sent mail"}
        width={137}
        height={137}
        className={"mt-[40px]"}
      />
      <div
        className={
          "mt-[40px] font-bold text-center text-[16px] text-neutral-main"
        }
      >
        Please check your mailbox.
      </div>
      <div className={"font-bold text-center text-[16px] text-neutral-main"}>
        Authentication will be completed by clicking the authentication link in
        the email.
      </div>
      <div className={"mt-[25px]"}>
        <InfoLink
          url={"https://www.tobiratory.com/about"}
          text={"Haven't received the email? Click here."}
        />
      </div>
    </>
  );
};

const InfoLink = ({ url, text }: { url: string; text: string }) => {
  return (
    <a
      href={url}
      className={"text-secondary-main underline"}
      target="_blank"
      rel="noreferrer"
    >
      <div className={"flex flex-row items-center"}>
        <div
          className={"w-[24px] h-[24px] bg-secondary-main"}
          style={{
            WebkitMaskImage: "url(/journal/images/icon/info-icon.svg)",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            WebkitMaskSize: "contain",
          }}
        ></div>
        <div className={"font-normal text-[20px] ml-[5px] pb-[2px]"}>
          {text}
        </div>
      </div>
    </a>
  );
};

export default ConfirmationSent;
