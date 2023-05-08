import Link from "next/link";
import RedeemStatusPC from "./RedeemStatusPc";
import CautionIcon from "../../../../../../public/images/icon/caution_journal.svg";

const ServerErrorPc: React.FC = () => {
  return (
    <RedeemStatusPC
      icon={<CautionIcon className={"w-[20%] h-full"} />}
      title={"Error"}
      description={
        <p className="text-2xl text-primary grid content-center">
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
      }
    />
  );
};

export default ServerErrorPc;
