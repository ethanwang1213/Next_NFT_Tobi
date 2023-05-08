import RedeemStatusSP from "./RedeemStatusSp";
import FeatherCheckIcon from "../../../../../../public/images/icon/feathercheck_journal.svg";
import CheckNFTButton from "../../CloseModalButton/CheckNFTButton";

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
        <CheckNFTButton className="btn btn-secondary btn-md btn-circle text-lg w-[90%] mt-6" />
      }
    />
  );
};

export default SuccessSp;
