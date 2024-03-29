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
          <BackLink onClickBack={onClickBack} />
        </div>
        <div className={"font-bold text-[32px]"}>
          確認メールを送信しました！
        </div>
        <Image
          src={"/admin/images/mail.svg"}
          alt={"sent mail"}
          width={329}
          height={282}
          className={"mt-[100px]"}
        />
        <div className={"mt-[50px] font-medium text-[16px] text-base-content"}>
          メールボックスをご確認下さい。
        </div>
        <div>メール内の認証リンクをクリックすることで認証が完了します。</div>
        <div className={"mt-[30px]"}>
          <InfoLink
            url={"https://www.tobiratory.com/about"}
            text={"メールが届きませんか？"}
          />
        </div>
      </div>
    </>
  );
};

export default ConfirmationSent;
