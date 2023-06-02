import { useContext } from "react";
import {
  RedeemContext,
  RedeemStatus,
} from "../../../../contexts/RedeemContextProvider";
import { functions } from "@/firebase/client";
import { httpsCallable } from "firebase/functions";
import { useHoldNFTs } from "@/contexts/HoldNFTsProvider";
import useRecordNewActivity from "@/hooks/useRecordNewActivity";

/**
 * 引き換えボタンのコンポーネント
 * @param param0
 * @returns
 */
const RedeemButton: React.FC = () => {
  const { redeemStatus, inputCode, modalInputIsChecked } =
    useContext(RedeemContext);
  const { shouldUpdate } = useHoldNFTs();
  const { recordNewActivity } = useRecordNewActivity();

  const onClick = () => {
    if (redeemStatus.current === "CHECKING") return;
    modalInputIsChecked.set(true);

    redeemStatus.set("CHECKING");

    if (process.env["NEXT_PUBLIC_DEBUG_MODE"] === "true") {
      // Debugモード：1秒後にランダムなステータスを返す
      setTimeout(() => {
        // "SUCCESS", "INCORRECT", "SERVER_ERROR"からランダムに取得
        const status = ["SUCCESS", "INCORRECT", "SERVER_ERROR"][
          Math.floor(Math.random() * 3)
        ] as RedeemStatus;
        redeemStatus.set(status);
      }, 1000);
    } else {
      const redeem = inputCode.current;
      const callable = httpsCallable(functions, "checkRedeem");
      callable({ redeem })
        .then((result) => {
          console.log(result);
          redeemStatus.set("SUCCESS");
          shouldUpdate.set(true);
          recordNewActivity(`${result.data as string} をJournalに追加した`);
        })
        .catch((error) => {
          console.log(error);
          redeemStatus.set(
            "INCORRECT"
            // "SERVER_ERROR"
          );
        });
    }
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
