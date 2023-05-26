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
      className={`btn btn-accent btn-md sm:btn-lg btn-circle sm:rounded-3xl w-[70%] sm:w-[60%] sm:h-[74px] text-[22px] sm:text-[36px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.6)] ${
        redeemStatus.current === "CHECKING" ? "btn-disabled" : ""
      }`}
    >
      引き換え
    </button>
  );
};

export default RedeemButton;
