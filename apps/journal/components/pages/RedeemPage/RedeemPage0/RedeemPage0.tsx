import PageTitle from "../../../PageTitle/PageTitle";
import RedeemPC0 from "../sub/RedeemPC0/RedeemPC0";
import RedeemSP0 from "../sub/RedeemSP0/RedeemSP0";

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
          <RedeemPC0 />
        </div>
        <div className={`block sm:hidden grow`}>
          <RedeemSP0 />
        </div>
      </>
    </div>
  );
};

export default RedeemPage0;
