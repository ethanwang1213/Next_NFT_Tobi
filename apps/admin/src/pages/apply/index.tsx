import { useAuth } from "contexts/AdminAuthProvider";
import { GetStaticPropsContext, Metadata } from "next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/router";
import { MutableRefObject, useRef } from "react";
import Button from "ui/atoms/Button";
import AccountConfirmDialog from "ui/organisms/admin/AccountConfirmDialog";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`admin/messages/${locale}.json`)).default,
    },
  };
}

export const metadata: Metadata = {
  title: "Tobiratory Creator Programに参加",
};

const ConfirmModal = ({
  dialogRef,
}: {
  dialogRef: MutableRefObject<HTMLDialogElement>;
}) => {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const t = useTranslations("TCP");

  return (
    <AccountConfirmDialog
      title={t("JoinThisAccount")}
      account={user}
      firstButtonProp={{
        caption: t("ApplyDifferentAccount"),
        isPrimary: false,
        callback: signOut,
      }}
      secondButtonProp={{
        caption: t("Next"),
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
  const t = useTranslations("TCP");

  return (
    <div className="md:container px-6 h-full mx-auto sm:py-20 py-10 text-center font-normal text-base text-[#5A5A5A] flex-1">
      <Image
        src="/admin/images/png/tobiratory.png"
        width={191}
        height={194}
        alt="Tobiratory"
        className="mx-auto sm:w-[191px] sm:h-[194px] w-[78px] h-[79px]"
      />
      <div className="text-[20px] sm:text-[48px] sm:mt-28 mt-10 font-bold">
        {t("Program")}
      </div>
      <div className="mt-10 mb-3 sm:text-[16px] text-[13px] sm:text-center text-left font-semibold">
        Tobiratory Creator Programに参加すると以下のことが可能になります。
      </div>
      <p className="sm:block hidden">
        内容は過去のもの
        <br />
      </p>
      <div className="sm:text-[16px] text-[15px] sm:text-center text-left font-medium">
        <p>Creator Basic/Pro</p>
        <p>・独自のコンテンツページ</p>
        <p>・デジタルアイテムの無料配布</p>
        <p>・SHOWCASE機能追加</p>
        <p>（SAIDANに販売したいサンプルデジタルアイテムを飾って公開）</p>
        <p>・デジタルアイテムの販売</p>
      </div>

      <div className="mt-10 text-[#717171] flex flex-row justify-center items-center">
        <Image
          src="/admin/images/info-icon-2.svg"
          width={16}
          height={16}
          alt="information"
          className="mr-2"
        />
        <span className="sm:text-md text-[12px] sm:text-center text-left">
          {t("ApplyLimit")}
        </span>
      </div>
      <Button
        type="button"
        className={`text-[16px] md:text-3xl bg-primary text-white rounded-[88px] py-4 px-8 mt-16`}
        onClick={handleButtonClick}
      >
        {t("Program")}
      </Button>
      <ConfirmModal dialogRef={modalRef} />
    </div>
  );
};

export default Index;
