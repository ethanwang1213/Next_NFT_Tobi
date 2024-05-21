import Image from "next/image";
import SampleDetailView from "./SampleDetailView";

const WorkspaceSampleDetailPanel = () => {
  return (
    <div className="absolute top-0 left-0 w-[316px] bg-[#001327] h-full overflow-y-auto px-4 pt-6 pb-4">
      <div className="flex flex-col justify-between items-center gap-6 text-base-white min-h-full">
        <div>
          <Image
            width={21}
            height={24}
            src="/admin/images/icon/delete-icon.svg"
            alt="delete icon"
            style={{
              visibility: "hidden",
            }}
          />
        </div>
        <SampleDetailView />
        <div className="flex w-full justify-end">
          <Image
            width={21}
            height={24}
            src="/admin/images/icon/delete-icon.svg"
            alt="delete icon"
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSampleDetailPanel;
