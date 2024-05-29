import React from "react";
import SampleDetailView from "./SampleDetailView";

const ShowcaseSampleDetail = ({ id }: { id: number }) => {
  return (
    <div className="absolute top-0 left-0 w-[316px] bg-gray-800 bg-opacity-50 h-full overflow-y-auto px-4 pt-6 pb-10">
      <SampleDetailView id={id} />
    </div>
  );
};

export default React.memo(ShowcaseSampleDetail);
