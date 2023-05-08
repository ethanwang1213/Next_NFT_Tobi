import RedeemPageTitle from "../../../PageTitle/RedeemPageTitle";
import RedeemPC0 from "./pc/RedeemPc0";
import RedeemSP0 from "./sp/RedeemSp0";

/**
 * 引き換えページの左ページ
 * @returns
 */
const RedeemPage0: React.FC = () => {
  return (
    <div className="page">
      <RedeemPageTitle isShown={true} />
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
