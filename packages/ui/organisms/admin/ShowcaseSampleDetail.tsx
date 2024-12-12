import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import SampleDetailView from "./SampleDetailView";

const ShowcaseSampleDetail = ({
  id,
  digitalItems,
  showSampleDetailView,
  showDetailView,
  handleNftModelGeneratedRef,
  deleteAllActionHistory,
}: {
  id: number;
  digitalItems: any;
  showSampleDetailView: boolean;
  showDetailView: boolean;
  handleNftModelGeneratedRef: React.MutableRefObject<
    (itemId: number, nftModelBase64: string) => void
  >;
  deleteAllActionHistory: () => void;
}) => {
  const t = useTranslations("Showcase");
  return (
    <div className="pointer-events-auto">
      <div
        className={`absolute top-[21px] w-[320px] bottom-[18px] rounded-3xl bg-gray-600 bg-opacity-50 backdrop-blur-[25px] px-[40px] pt-[70px] pb-[20px] transition-transform duration-300 ease-in-out ${
          showSampleDetailView
            ? "translate-x-0 left-4"
            : "-translate-x-full z-0"
        }`}
      >
        <SampleDetailView
          digitalItems={digitalItems}
          id={id}
          section={"showcase"}
          sampleitemId={null}
          deleteHandler={undefined}
          handleNftModelGeneratedRef={handleNftModelGeneratedRef}
          deleteAllActionHistory={deleteAllActionHistory}
        />
      </div>
      <div
        className={`absolute top-[38px] transition-transform duration-300 ease-in-out ${
          showDetailView
            ? "translate-x-4 left-[38px]"
            : "-translate-x-full"
        }`}
      >
        <Link
          href="/contents"
          className="rounded-[5px] bg-gray-400 bg-opacity-50 flex items-center gap-2 text-white backdrop-blur-[8px] p-2"
        >
          <Image
            width={32}
            height={32}
            alt="Link back Icon"
            src="/admin/images/icon/arrow-back-icon.svg"
          />
          <span>{t("Exit")}</span>
        </Link>
      </div>
    </div>
  );
};

export default React.memo(ShowcaseSampleDetail);
