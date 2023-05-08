import RedeemStatusSP from "./RedeemStatusSp";
import Link from "next/link";
import FeatherIcon from "../../../../../public/images/icon/feather_journal.svg";
import FeatherCheckIcon from "../../../../../public/images/icon/feathercheck_journal.svg";

type Props = {
  redeemStatus: "CHECKING" | "SUCCESS" | "INCORRECT" | "SERVER_ERROR";
};

const RedeemStatusModal: React.FC<Props> = ({ redeemStatus }) => {
  return (
    <>
      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal px-4">
        <div className="modal-box">
          <div className="h-full flex flex-col text-center m-2 mt-6 relative">
            {redeemStatus === "CHECKING" && (
              <RedeemStatusSP
                icon={
                  <div className="w-full flex justify-center">
                    <FeatherIcon className={"w-[70%] h-full"} />
                  </div>
                }
                title={"Checking Code..."}
              />
            )}
            {redeemStatus === "SUCCESS" && (
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
            )}
            {redeemStatus === "INCORRECT" && (
              <RedeemStatusSP
                icon={"icon"}
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
            )}
            {redeemStatus === "SERVER_ERROR" && (
              <>
                <RedeemStatusSP
                  icon={"icon"}
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
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RedeemStatusModal;
