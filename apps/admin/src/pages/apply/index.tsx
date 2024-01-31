import clsx from "clsx";
import { useNavbar } from "contexts/AdminNavbarProvider";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Modal from "react-modal";
import Button from "ui/atoms/Button";

export const metadata: Metadata = {
  title: "Tobiratory Creator Programに参加",
};

const ConfirmModal = ({ isOpen, onClose }) => {
  const { menuStatus } = useNavbar();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      // style={customStyles}
      ariaHideApp={false}
      className={clsx(
        "absolute w-[28rem] h-[39rem] top-1/2 left-1/2 -translate-y-1/2",
        menuStatus ? "-translate-x-[6rem]" : "-translate-x-[11.2rem]",
        "bg-red-300 rounded-[30px] text-[#5A5A5A] p-7",
      )}
    >
      <Image
        src={"/admin/images/icon/close.svg"}
        width={16}
        height={20}
        alt=""
        className="float-right"
        onClick={onClose}
      />
      <div className="flex flex-col items-center mt-10">
        <div className="text-2xl">このアカウントでTCPに参加する</div>
        <Image
          width={153}
          height={151}
          src={"/admin/images/png/account-place.png"}
          alt=""
          className="mt-10"
        />
        <div className="mt-8 text-[20px]">ACCOUNT NAME</div>
        <div className="mt-1 mb-1 text-base">@account_name</div>
        <Link className="mt-14" href={"#"}>
          <Button
            label="別のアカウントで申請"
            type="button"
            className={clsx(
              "w-[16.75rem] h-14 bg-transparent",
              "rounded-[30px] border border-[#1779DE]",
              "text-[#1779DE] text-[20px] leading-[3.5rem]",
            )}
          />
        </Link>
        <Link className="mt-7" href={"/apply/terms"}>
          <Button
            label="次へ"
            type="button"
            className={clsx(
              "w-[16.75rem] h-14 bg-[#1779DE]",
              "rounded-[30px] border-none",
              "text-white text-[20px] leading-[3.5rem]",
            )}
          />
        </Link>
      </div>
    </Modal>
  );
};

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    // <div className="h-full flex flex-col justify-center">
    <div className="container h-full mx-auto py-20 text-center font-normal text-base text-[#5A5A5A] flex-1">
      <Image
        src="/admin/images/png/tobiratory.png"
        width={191}
        height={194}
        alt=""
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
          alt=""
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
      <ConfirmModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
    // </div>
  );
};

export default Index;
