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
      className={`btn btn-md sm:btn-lg btn-circle sm:rounded-3xl w-[60%] sm:w-[40%] text-2xl sm:text-3xl ${
        redeemStatus.current === "CHECKING" ? "btn-disabled" : ""
      }`}
    >
      Redeem
    </button>
  );
};

export default RedeemButton;
