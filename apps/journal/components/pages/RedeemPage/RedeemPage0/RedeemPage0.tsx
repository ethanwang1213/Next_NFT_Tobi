import PageTitle from "../../../PageTitle/PageTitle";
import Redeem0PC from "../sub/Redeem0PC/Redeem0PC";
import Redeem0SP from "../sub/Redeem0SP/Redeem0SP";

/**
 * 引き換えページの左ページ
 * @returns
 */
const RedeemPage0: React.FC = () => {
  return (
    <div className="page">
      <PageTitle isShown={true} pageType={"REDEEM"} />
      <>
        <div className={`hidden sm:block grow`}>
          <Redeem0PC />
        </div>
        <div className={`block sm:hidden grow`}>
          <Redeem0SP />
        </div>
      </>
    </div>
  );
};

export default RedeemPage0;
