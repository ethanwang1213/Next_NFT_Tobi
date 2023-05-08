import RedeemStatusPC from "./RedeemStatusPc";
import FeatherCheckIcon from "../../../../../../public/images/icon/feathercheck_journal.svg";

const SuccessPc: React.FC = () => {
  return (
    <RedeemStatusPC
      icon={<FeatherCheckIcon className={"w-full h-full"} />}
      title={"Success!!"}
      description={
        <button className="btn btn-outline btn-lg rounded-3xl text-3xl w-[40%] absolute bottom-0">
          Check your NFTs
        </button>
      }
    />
  );
};

export default SuccessPc;
