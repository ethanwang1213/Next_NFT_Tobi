import Link from "next/link";
import RedeemStatusPC from "./RedeemStatusPC";
import FeatherIcon from "../../../../../public/images/icon/feather_journal.svg";
import FeatherCheckIcon from "../../../../../public/images/icon/feathercheck_journal.svg";

type Props = {
  redeemStatus: "CHECKING" | "SUCCESS" | "INCORRECT" | "SERVER_ERROR";
};

const RedeemPC1: React.FC<Props> = ({ redeemStatus }) => {
  return (
    <div className="h-full flex flex-col min-h-[300px] text-center relative">
      {redeemStatus === "CHECKING" && (
        <RedeemStatusPC
          icon={<FeatherIcon className={"w-full h-full"} />}
          title={"Checking code..."}
        />
      )}
      {redeemStatus === "SUCCESS" && (
        <RedeemStatusPC
          icon={<FeatherCheckIcon className={"w-full h-full"} />}
          title={"Success!!"}
          description={
            <button className="btn btn-outline btn-lg rounded-3xl text-3xl w-[40%] absolute bottom-0">
              Check your NFTs
            </button>
          }
        />
      )}
      {redeemStatus === "INCORRECT" && (
        <RedeemStatusPC
          icon={"icon"}
          title={"Error"}
          description={
            <p className="text-3xl font-bold text-error grid content-center">
              The Redemption Code is incorrect.
            </p>
          }
        />
      )}
      {redeemStatus === "SERVER_ERROR" && (
        <>
          <RedeemStatusPC
            icon={"icon"}
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
        </>
      )}
    </div>
  );
};

export default RedeemPC1;
