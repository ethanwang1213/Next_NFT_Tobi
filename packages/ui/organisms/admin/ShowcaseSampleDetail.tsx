import React from "react";
import SampleDetailView from "./SampleDetailView";

const ShowcaseSampleDetail = ({ id }: { id: number }) => {
  return (
    <div className="absolute top-0 left-0 w-[316px] bg-gray-600 bg-opacity-50 backdrop-blur-[25px] h-full overflow-y-auto px-4 pt-6 pb-10">
      <div className="flex flex-col justify-center min-h-full">
        <SampleDetailView id={id} />
      </div>
    </div>
  );
};

export default React.memo(ShowcaseSampleDetail);
