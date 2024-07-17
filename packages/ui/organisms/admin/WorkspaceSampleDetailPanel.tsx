import Image from "next/image";
import SampleDetailView from "./SampleDetailView";

const WorkspaceSampleDetailPanel = ({ id }: { id: number }) => {
  return (
    <div className="absolute top-0 left-0 w-[316px] h-full bg-[#001327] px-[40px] pt-6 pb-4 pointer-events-auto">
      <div className="h-full flex flex-col justify-center">
        <SampleDetailView id={id} />
      </div>
    </div>
  );
};

export default WorkspaceSampleDetailPanel;
