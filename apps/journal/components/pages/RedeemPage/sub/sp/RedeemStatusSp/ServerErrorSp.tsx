import RedeemStatusSP from "./RedeemStatusSp";
import CautionIcon from "../../../../../../public/images/icon/caution_journal.svg";
import Link from "next/link";

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
              <Link href={"#"} className="link link-info">
                {"customer support"}
              </Link>
              {"."}
            </span>
          </p>
          <button className="btn btn-secondary btn-md btn-circle text-lg w-[90%] mb-6">
            Contact
          </button>
          <button className="btn btn-secondary btn-md btn-circle text-lg w-[90%]">
            Try again
          </button>
        </div>
      }
    />
  );
};

export default ServerErrorSp;
