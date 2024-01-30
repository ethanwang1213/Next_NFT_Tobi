import { LegacyRef } from "react";

type Props = {
  dialogRef: LegacyRef<HTMLDialogElement>;
};

const MailSentDialog = ({ dialogRef }: Props) => {
  return (
    <dialog id="signInModal" className="modal" ref={dialogRef}>
      <form method="dialog" className="modal-box bg-neutral">
        <h3 className="font-bold text-base sm:text-xl text-neutral-content">
          メールを送信しました
        </h3>
        <div className="text-xs sm:text-sm text-neutral-content">
          <p className="py-4">
            サインイン認証のメールを記入されたアドレスへ送信しました。
            <br />
            メールをご確認いただき、記載されたURLからサインインを完了させてください。
          </p>
          <p className="font-bold">メールが届かない場合</p>
          <ul className="list-disc pl-6 mt-2">
            <li>迷惑メールフォルダやフィルターの設定をご確認ください。</li>
            <li>時間をあけてから、再度サインインをお試しください。</li>
          </ul>
        </div>
        <div className="modal-action">
          <button className="btn btn-sm sm:btn-md text-xs sm:text-base btn-primary text-neutral">
            閉じる
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default MailSentDialog;
