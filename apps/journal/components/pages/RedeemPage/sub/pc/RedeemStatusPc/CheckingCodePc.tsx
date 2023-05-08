import RedeemStatusPC from "./parent/RedeemStatusPc";
import FeatherIcon from "../../../../../../public/images/icon/feather_journal.svg";

const CheckingCodePc: React.FC = () => {
  return (
    <RedeemStatusPC
      icon={<FeatherIcon className={"w-full h-full"} />}
      title={"Checking code..."}
    />
  );
};

export default CheckingCodePc;
