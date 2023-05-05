import PageTitle from "../../../PageTitle/PageTitle";
import Redeem0PC from "../sub/Redeem0PC/Redeem0PC";
import Redeem0SP from "../sub/Redeem0SP/Redeem0SP";

const RedeemPage0: React.FC = () => {
  return (
    <div className="page">
      <PageTitle isShown={true} pageType={"REDEEM"} />
      <>
        <div className={`hidden sm:block`}>
          <Redeem0PC />
        </div>
        <div className={`block sm:hidden`}>
          <Redeem0SP />
        </div>
      </>
    </div>
  );
};

export default RedeemPage0;
