import Image from "next/image";
import SampleDetailView from "./SampleDetailView";

const WorkspaceSampleDetailPanel = ({ id }: { id: number }) => {
  return (
    <div className="absolute top-0 left-0 w-[316px] h-full bg-[#001327] px-[40px] pt-6 pb-4">
      <div className="h-full flex flex-col justify-center">
        {/* <div>
          <Image
            width={21}
            height={24}
            src="/admin/images/icon/delete-icon.svg"
            alt="delete icon"
            style={{
              visibility: "hidden",
            }}
          />
        </div> */}
        <SampleDetailView id={id} />
        {/* <div className="flex w-full justify-end">
          <Image
            width={21}
            height={24}
            src="/admin/images/icon/delete-icon.svg"
            alt="delete icon"
            className="cursor-pointer"
          />
        </div> */}
      </div>
    </div>
  );
};

export default WorkspaceSampleDetailPanel;
