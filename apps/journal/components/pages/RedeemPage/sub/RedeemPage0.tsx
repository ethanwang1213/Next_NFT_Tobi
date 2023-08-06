import RedeemPageTitle from "../../../PageTitle/RedeemPageTitle";
import RedeemPc0 from "./pc/RedeemPc0";
import RedeemSp0 from "./sp/RedeemSp0";

/**
 * redeemページの左ページを表示するコンポーネント
 * @returns
 */
const RedeemPage0: React.FC = () => {
  return (
    <>
      <RedeemPageTitle isShown={true} />
      <>
        <div className={`hidden sm:block grow`}>
          <RedeemPc0 />
        </div>
        <div className={`block sm:hidden grow`}>
          <RedeemSp0 />
        </div>
      </>
    </>
  );
};

export default RedeemPage0;
