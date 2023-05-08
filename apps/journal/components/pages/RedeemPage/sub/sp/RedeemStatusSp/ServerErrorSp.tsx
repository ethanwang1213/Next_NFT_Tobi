import RedeemStatusSP from "./RedeemStatusSp";
import CautionIcon from "../../../../../../public/images/icon/caution_journal.svg";
import TryAgainButton from "../../CloseModalButton/TryAgainButton";
import CustomerSupportButton from "../../CloseModalButton/CustomerSupportButton";

const ServerErrorSp: React.FC = () => {
  return (
    <RedeemStatusSP
      icon={<CautionIcon className={"w-[40%] h-full"} />}
      title={"Error"}
      description={
        <div>
          <p className="text-primary grid content-center mb-6">
            <span>
              {"An error has occurred."}
              <br />
              {"Please contact "}
              <CustomerSupportButton
                className="link link-info"
                text="customer support"
              />
              {"."}
            </span>
          </p>
          <CustomerSupportButton
            className="btn btn-secondary btn-md btn-circle text-lg w-[90%] mb-6"
            text="Contact"
          />
          <TryAgainButton className="btn btn-secondary btn-md btn-circle text-lg w-[90%]" />
        </div>
      }
    />
  );
};

export default ServerErrorSp;
