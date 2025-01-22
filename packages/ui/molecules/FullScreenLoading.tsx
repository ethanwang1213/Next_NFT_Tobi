import Loading from "ui/atoms/Loading";

const FullScreenLoading = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <dialog open={isOpen} className="modal">
      <div className="bg-transparent">
        <Loading className="text-primary" />
      </div>
    </dialog>
  );
};

export default FullScreenLoading;
