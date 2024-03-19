import Image from "next/image";
import { useRef } from "react";
import Button from "ui/atoms/Button";
import BackLink from "ui/organisms/admin/BackLink";

type Props = {
  onClickBack: () => void;
};

const ConfirmationSent = ({ onClickBack }: Props) => {
  const mailDeliveryIssueRef = useRef<HTMLDialogElement>(null);

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
        <a
          href={"https://www.tobiratory.com/about"}
          className={"text-primary underline mt-[30px]"}
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
            <span className={"font-medium text-[12px]"}>
              メールが届きませんか？
            </span>
          </div>
        </a>
      </div>
      <MailDeliveryIssue dialogRef={mailDeliveryIssueRef} />
    </>
  );
};

const MailDeliveryIssue = ({ dialogRef }) => {
  return (
    <dialog ref={dialogRef} className="modal" style={{}}>
      <div className="modal-box overflow-hidden h-full p-0">
        <div className="overflow-auto h-full pt-[15px] pl-[15px] pr-[15px]">
          <h3 className="font-bold text-lg">メールが届かないですと？</h3>
          <div>
            吾輩わがはいは猫である。名前はまだ無い。
            どこで生れたかとんと見当けんとうがつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。吾輩はここで始めて人間というものを見た。しかもあとで聞くとそれは書生という人間中で一番獰悪どうあくな種族であったそうだ。この書生というのは時々我々を捕つかまえて煮にて食うという話である。しかしその当時は何という考もなかったから別段恐しいとも思わなかった。ただ彼の掌てのひらに載せられてスーと持ち上げられた時何だかフワフワした感じがあったばかりである。掌の上で少し落ちついて書生の顔を見たのがいわゆる人間というものの見始みはじめであろう。この時妙なものだと思った感じが今でも残っている。第一毛をもって装飾されべきはずの顔がつるつるしてまるで薬缶やかんだ。その後ご猫にもだいぶ逢あったがこんな片輪かたわには一度も出会でくわした事がない。のみならず顔の真中があまりに突起している。そうしてその穴の中から時々ぷうぷうと煙けむりを吹く。どうも咽むせぽくて実に弱った。これが人間の飲む煙草たばこというものである事はようやくこの頃知った。
            この書生の掌の裏うちでしばらくはよい心持に坐っておったが、しばらくすると非常な速力で運転し始めた。書生が動くのか自分だけが動くのか分らないが無暗むやみに眼が廻る。胸が悪くなる。到底とうてい助からないと思っていると、どさりと音がして眼から火が出た。それまでは記憶しているがあとは何の事やらいくら考え出そうとしても分らない。
            ふと気が付いて見ると書生はいない。たくさんおった兄弟が一疋ぴきも見えぬ。肝心かんじんの母親さえ姿を隠してしまった。その上今いままでの所とは違って無暗むやみに明るい。眼を明いていられぬくらいだ。はてな何でも容子ようすがおかしいと、のそのそ這はい出して見ると非常に痛い。吾輩は藁わらの上から急に笹原の中へ棄てられたのである。
          </div>
          <Button
            className="bg-base-100 text-primary border-[1px] border-primary w-[179px] h-[48px] rounded-2xl"
            onClick={() => dialogRef.current.close()}
          >
            閉じる
          </Button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ConfirmationSent;
