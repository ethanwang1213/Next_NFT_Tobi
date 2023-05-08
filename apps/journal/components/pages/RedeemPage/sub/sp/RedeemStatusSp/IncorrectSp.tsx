import CautionIcon from "../../../../../../public/images/icon/caution_journal.svg";
import RedeemStatusSP from "./RedeemStatusSp";

const IncorrectSp: React.FC = () => {
  return (
    <RedeemStatusSP
      icon={<CautionIcon className={"w-[40%] h-full"} />}
      title={"Error"}
      description={
        <div>
          <p className="font-bold text-error grid content-center mb-8">
            The Redemption Code is incorrect.
          </p>
          <button className="btn btn-secondary btn-md btn-circle text-lg w-[90%]">
            Check your NFTs
          </button>
        </div>
      }
    />
  );
};

export default IncorrectSp;
