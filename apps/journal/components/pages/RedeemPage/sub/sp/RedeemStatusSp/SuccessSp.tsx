import RedeemStatusSP from "./RedeemStatusSp";
import FeatherCheckIcon from "../../../../../../public/images/icon/feathercheck_journal.svg";

const SuccessSp: React.FC = () => {
  return (
    <RedeemStatusSP
      icon={
        <div className="w-full flex justify-center">
          <FeatherCheckIcon className={"w-[60%] h-full"} />
        </div>
      }
      title={"Success!!"}
      description={
        <button className="btn btn-secondary btn-md btn-circle text-lg w-[90%] mt-6">
          Check your NFTs
        </button>
      }
    />
  );
};

export default SuccessSp;
