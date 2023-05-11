import { useContext } from "react";
import { RedeemContext } from "../../../../contexts/RedeemContextProvider";

/**
 * 引き換えボタンのコンポーネント
 * @param param0
 * @returns
 */
const RedeemButton: React.FC = () => {
  const { redeemStatus, modalInputIsChecked } = useContext(RedeemContext);

  const onClick = () => {
    if (redeemStatus.current === "CHECKING") return;
    modalInputIsChecked.set(true);

    redeemStatus.set("CHECKING");
    // TODO: 引き換えの処理を実行する
    // 仮置きとして、1秒後にCHECKINGからstatusが更新されるようにしている
    setTimeout(() => {
      redeemStatus.set(
        // "INCORRECT"
        // "SERVER_ERROR"
        "SUCCESS"
      );
    }, 1000);
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
