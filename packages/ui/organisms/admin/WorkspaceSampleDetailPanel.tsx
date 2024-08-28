import SampleDetailView from "./SampleDetailView";

interface WorkspaceSampleDetailPanelProps {
  id: number;
  sampleitemId : number;
  deleteHandler: (ids: number[]) => void;
}

const WorkspaceSampleDetailPanel: React.FC<WorkspaceSampleDetailPanelProps> = ({
  id,
  sampleitemId,
  deleteHandler,
}) => {
  return (
    <div className="absolute top-0 left-0 w-[316px] h-full bg-[#001327] px-[28px] pt-6 pb-4 pointer-events-auto">
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
