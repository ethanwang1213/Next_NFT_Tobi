import SampleDetailView from "./SampleDetailView";

interface WorkspaceSampleDetailPanelProps {
  id: number;
  sampleitemId: number;
  deleteHandler: (ids: number[]) => void;
}

const WorkspaceSampleDetailPanel: React.FC<WorkspaceSampleDetailPanelProps> = ({
  id,
  sampleitemId,
  deleteHandler,
}) => {
  return (
    <div className="absolute top-0 left-0 lg:w-[316px] w-[280px] h-full bg-[#001327] lg:px-[28px] px-[15px] pt-6 pb-4 pointer-events-auto">
      <div className="h-full flex flex-col justify-center">
        <SampleDetailView
          id={id}
          sampleitemId={sampleitemId}
          section={"workspace"}
          deleteHandler={deleteHandler}
        />
      </div>
    </div>
  );
};

export default WorkspaceSampleDetailPanel;
