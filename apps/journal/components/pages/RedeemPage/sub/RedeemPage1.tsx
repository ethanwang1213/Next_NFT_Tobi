import RedeemPageTitle from "../../../PageTitle/RedeemPageTitle";
import RedeemPC1 from "./pc/RedeemPc1";

/**
 * redeemページの右ページを表示するコンポーネント
 * @returns
 */
const RedeemPage1: React.FC = () => {
  return (
    <>
      <RedeemPageTitle isShown={false} />
      <div className={`hidden sm:block grow overflow-y-hidden text-[#7D5337]`}>
        <RedeemPC1 />
      </div>
    </>
  );
};

export default RedeemPage1;
