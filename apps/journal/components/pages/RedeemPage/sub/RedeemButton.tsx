import { useContext } from "react";
import { RedeemContext } from "../../../../contexts/RedeemContextProvider";
import { functions } from "@/firebase/client";
import { httpsCallable } from "firebase/functions";

/**
 * 引き換えボタンのコンポーネント
 * @param param0
 * @returns
 */
const RedeemButton: React.FC = () => {
  const { redeemStatus, inputCode, modalInputIsChecked } = useContext(RedeemContext);

  const onClick = () => {
    if (redeemStatus.current === "CHECKING") return;
    modalInputIsChecked.set(true);

    redeemStatus.set("CHECKING");

    const redeem = inputCode.current;
    const callable = httpsCallable(functions, "checkRedeem");
    callable({ redeem }).then((result) => {
      console.log(result);
      redeemStatus.set(
        "SUCCESS"
      );
    }).catch((error) => {
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
