import { Metadata } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { MutableRefObject, useRef } from "react";
import Button from "ui/atoms/Button";
import AccountConfirmDialog from "ui/organisms/admin/AccountConfirmDialog";
import { useAuth } from "contexts/AdminAuthProvider";

export const metadata: Metadata = {
  title: "Tobiratory Creator Programに参加",
};

const ConfirmModal = ({
  dialogRef,
}: {
  dialogRef: MutableRefObject<HTMLDialogElement>;
}) => {
  const router = useRouter();
  const { signOut } = useAuth();

  return (
    <AccountConfirmDialog
      title="このアカウントでTCPに参加する?"
      account={null}
      firstButtonProp={{
        caption: "別のアカウントで申請",
        isPrimary: false,
        callback: signOut,
      }}
      secondButtonProp={{
        caption: "次へ",
        isPrimary: true,
        callback: () => router.replace("/apply/terms"),
      }}
      dialogRef={dialogRef}
    />
  );
};

const Index = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const handleButtonClick = () => {
    modalRef.current.showModal();
  };

  return (
    <div className="container h-full mx-auto py-20 text-center font-normal text-base text-[#5A5A5A] flex-1">
      <Image
        src="/admin/images/png/tobiratory.png"
        width={191}
        height={194}
        alt="Tobiratory"
        className="mx-auto"
      />
      <div className="text-[40px] mt-28">Tobiratory Creator Program</div>
      <div className="mt-10 mb-3">
        Tobiratory Creator Programに参加すると以下のことが可能になります。
      </div>
      <div>
        内容は過去のもの
        <br />
      </div>
      <div>Creator Basic/Pro</div>
      <div>・独自のコンテンツページ</div>
      <div>・デジタルアイテムの無料配布</div>
      <div>・SHOWCASE機能追加</div>
      <div>（SAIDANに販売したいサンプルデジタルアイテムを飾って公開）</div>
      <div>・デジタルアイテムの販売</div>
      <div className="mt-10 text-[#717171] flex flex-row justify-center items-center">
        <Image
          src="/admin/images/info-icon-2.svg"
          width={16}
          height={16}
          alt="information"
          className="mr-2"
        />
        <span>１アカウントにつきコンテンツは１つまで申請できます</span>
      </div>
      <Button
        label="Tobiratory Creator Program"
        type="button"
        className="w-[38rem] h-[4.5rem] text-3xl bg-[#1779DE] text-white rounded-[88px] px-10 py-3 mt-6"
        onClick={handleButtonClick}
      />
      <ConfirmModal dialogRef={modalRef} />
    </div>
  );
};

export default Index;
