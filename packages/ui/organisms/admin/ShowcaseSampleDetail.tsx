import Image from "next/image";
import Link from "next/link";
import React from "react";
import SampleDetailView from "./SampleDetailView";

const ShowcaseSampleDetail = ({
  id,
  showSampleDetailView,
  showDetailView,
}: {
  id: number;
  showSampleDetailView: boolean;
  showDetailView: boolean;
}) => {
  return (
    <div className="pointer-events-auto">
      {showSampleDetailView && (
        <div className="absolute top-[21px] left-4 w-[320px] bottom-[18px] rounded-3xl bg-gray-600 bg-opacity-50 backdrop-blur-[25px] px-[40px] pt-[154px] pb-[81px]">
          <SampleDetailView id={id} />
        </div>
      )}
      {showDetailView && (
        <div className="absolute left-[38px] top-[39px]">
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
            <span>Exit</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default React.memo(ShowcaseSampleDetail);
