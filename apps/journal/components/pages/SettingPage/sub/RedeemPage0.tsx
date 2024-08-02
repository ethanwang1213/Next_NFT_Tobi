import RedeemPageTitle from "../../../PageTitle/RedeemPageTitle";
import SettingPc0 from "./pc/SettingPc0";
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
          <SettingPc0 />
        </div>
        <div className={`block sm:hidden grow`}>
          <RedeemSp0 />
        </div>
      </>
    </>
  );
};

export default RedeemPage0;
