import React from "react";
import SampleDetailView from "./SampleDetailView";

const ShowcaseSampleDetail = ({ id }: { id: number }) => {
  return (
    <div className="absolute top-[21px] left-4 w-[320px] bottom-[18px] rounded-3xl bg-gray-600 bg-opacity-50 backdrop-blur-[25px] px-[40px] pt-[154px] pb-[81px] ml-3">
      <SampleDetailView id={id} />
    </div>
  );
};

export default React.memo(ShowcaseSampleDetail);
