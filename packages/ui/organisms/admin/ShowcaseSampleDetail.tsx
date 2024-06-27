import React from "react";
import SampleDetailView from "./SampleDetailView";

const ShowcaseSampleDetail = ({ id }: { id: number }) => {
  return (
    <div className="absolute top-0 left-0 w-[316px] h-full bg-gray-600 bg-opacity-50 backdrop-blur-[25px] px-[40px] pt-6 pb-10">
      <div className="h-full flex flex-col justify-center">
        <SampleDetailView id={id} />
      </div>
    </div>
  );
};

export default React.memo(ShowcaseSampleDetail);
