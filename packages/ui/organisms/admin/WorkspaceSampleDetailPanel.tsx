import SampleDetailView from "./SampleDetailView";

interface WorkspaceSampleDetailPanelProps {
  id: number;
  sampleitemId: number;
  digitalItems: any;
  deleteHandler: (ids: number[]) => void;
  handleNftModelGeneratedRef: React.MutableRefObject<
    (itemId: number, nftModelBase64: string) => void
  >;
  deleteAllActionHistory: () => void;
}

const WorkspaceSampleDetailPanel: React.FC<WorkspaceSampleDetailPanelProps> = ({
  id,
  sampleitemId,
  digitalItems,
  handleNftModelGeneratedRef,
  deleteHandler,
  deleteAllActionHistory,
}) => {
  return (
    <div className="absolute top-0 left-0 lg:w-[316px] w-[280px] h-full bg-[#001327] lg:px-[28px] px-[15px] pt-6 pb-4 pointer-events-auto z-20">
      <div className="h-full flex flex-col justify-center">
        <SampleDetailView
          id={id}
          digitalItems={digitalItems}
          sampleitemId={sampleitemId}
          section={"workspace"}
          deleteHandler={deleteHandler}
          handleNftModelGeneratedRef={handleNftModelGeneratedRef}
          deleteAllActionHistory={deleteAllActionHistory}
        />
      </div>
    </div>
  );
};

export default WorkspaceSampleDetailPanel;
