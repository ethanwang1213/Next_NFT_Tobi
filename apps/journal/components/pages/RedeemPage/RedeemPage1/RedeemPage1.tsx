import PageTitle from "../../../PageTitle/PageTitle";
import Redeem1 from "../sub/Redeem1/Redeem1";

const RedeemPage0: React.FC = () => {
  return (
    <div className="page">
      <PageTitle isShown={false} pageType={"REDEEM"} />
      <div className={`hidden sm:block`}>
        <Redeem1 />
      </div>
    </div>
  );
};

export default RedeemPage0;
