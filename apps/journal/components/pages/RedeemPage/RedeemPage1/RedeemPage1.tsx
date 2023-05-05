import PageTitle from "../../../PageTitle/PageTitle";
import RedeemPC1 from "../sub/RedeemPC1/RedeemPC1";

const RedeemPage0: React.FC = () => {
  return (
    <div className="page">
      <PageTitle isShown={false} pageType={"REDEEM"} />
      <div className={`hidden sm:block grow overflow-y-hidden text-[#7D5337]`}>
        <RedeemPC1 redeemStatus={"SUCCESS"} />
      </div>
    </div>
  );
};

export default RedeemPage0;
