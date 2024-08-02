import SettingPageTitle from "../../../PageTitle/SettingPageTitle";
import SettingPc0 from "./pc/SettingPc0";
import SettingSp0 from "./sp/RedeemSp0";

/**
 * redeemページの左ページを表示するコンポーネント
 * @returns
 */
const SettingPage0: React.FC = () => {
  return (
    <>
      <SettingPageTitle isShown={true} />
      <>
        <div className={`hidden sm:block grow`}>
          <SettingPc0 />
        </div>
        <div className={`block sm:hidden grow`}>
          <SettingSp0 />
        </div>
      </>
    </>
  );
};

export default SettingPage0;
