import { useAuth } from "contexts/AdminAuthProvider";
import { GetStaticPropsContext, Metadata } from "next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/router";
import { MutableRefObject, useRef } from "react";
import Button from "ui/atoms/Button";
import AccountConfirmDialog from "ui/organisms/admin/AccountConfirmDialog";
import { getMessages } from "../../../messages/messages";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
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
      <p className="text-[20px] sm:text-[48px] sm:mt-28 mt-10 font-bold">
        {t("Program")}
      </p>
      <p className="mt-6 mb-10 sm:text-[16px] text-[13px] sm:text-center text-left font-semibold">
        {t("TobiratoryProgramTitle")}
      </p>
      <div className="flex flex-col space-y-10 sm:text-[16px] text-[13px] text-center">
        <div>
          <p className="sm:text-xl text-[16px] font-semibold">
            {t("YourContentPage")}
          </p>
          <p>{t("YourContentPageDescription")}</p>
        </div>
        <div>
          <p className="sm:text-xl text-[16px] font-semibold">
            {t("FreeDistribution")}
          </p>
          <p>{t("FreeDistributionDescription")}</p>
          <p>{t("FreeDistributionNote")}</p>
        </div>
        <div>
          <p className="sm:text-xl text-[16px] font-semibold">
            {t("DisplaySampleItems")}
          </p>
          <p>{t("DisplaySampleItemsDescription")}</p>
        </div>
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
          {t("SingleContentLimit")}
        </span>
      </div>
      <Button
        type="button"
        className={`text-[16px] bg-primary text-white rounded-[88px] py-4 px-8 mt-16`}
        onClick={handleButtonClick}
      >
        {t("Program")}
      </Button>
      <ConfirmModal dialogRef={modalRef} />
    </div>
  );
};

export default Index;
