import PageTitle from "../../../PageTitle";
import RedeemPC1 from "./pc/RedeemPc1";


const RedeemPage1: React.FC = () => {
  return (
    <div className="page">
      <PageTitle isShown={false} pageType={"REDEEM"} />
      <div className={`hidden sm:block grow overflow-y-hidden text-[#7D5337]`}>
        <RedeemPC1 />
      </div>
    </div>
  );
};

export default RedeemPage1;
