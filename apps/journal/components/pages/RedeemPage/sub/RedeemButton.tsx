import { useContext } from "react";
import { RedeemContext } from "../../../../contexts/RedeemContextProvider";
import { functions } from "@/firebase/client";
import { httpsCallable } from "firebase/functions";
import { useHoldNFTs } from "@/contexts/HoldNFTsProvider";
import { useActivityRecord } from "@/contexts/ActivityRecordProvider";

/**
 * 引き換えボタンのコンポーネント
 * @param param0
 * @returns
 */
const RedeemButton: React.FC = () => {
  const { redeemStatus, inputCode, modalInputIsChecked } =
    useContext(RedeemContext);
  const { shouldUpdate } = useHoldNFTs();
  const { addActivityRecord } = useActivityRecord();

  const onClick = () => {
    if (redeemStatus.current === "CHECKING") return;
    modalInputIsChecked.set(true);

    redeemStatus.set("CHECKING");

    const redeem = inputCode.current;
    const callable = httpsCallable(functions, "checkRedeem");
    callable({ redeem })
      .then((result) => {
        console.log(result);
        redeemStatus.set("SUCCESS");
        shouldUpdate.set(true);
        addActivityRecord({
          text: `${result.data as string} をJournalに追加した`,
          timestamp: Date.now() / 1000,
        });
      })
      .catch((error) => {
        console.log(error);
        redeemStatus.set(
          "INCORRECT"
          // "SERVER_ERROR"
        );
      });
  };

  return (
    <button
      onClick={onClick}
      className={`btn btn-accent btn-md sm:btn-lg btn-circle sm:rounded-3xl w-[70%] sm:w-[60%] sm:h-[74px] text-[22px] sm:text-[36px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.6)] ${
        redeemStatus.current === "CHECKING" ? "btn-disabled" : ""
      }`}
    >
      引き換え
    </button>
  );
};

export default RedeemButton;
