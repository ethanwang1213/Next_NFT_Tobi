import { useContext } from "react";
import { RedeemContext } from "../../../../contexts/RedeemContextProvider";

type Props = {
  isPc: boolean;
};

/**
 * 引き換えボタンのコンポーネント
 * @param param0
 * @returns
 */
const RedeemButton: React.FC<Props> = ({ isPc }) => {
  const { redeemStatus } = useContext(RedeemContext);

  const onClick = () => {
    redeemStatus.set("CHECKING");
    // TODO: 引き換えの処理を実行する
    // 仮置きとして、1秒後にCHECKINGからstatusが更新されるようにしている
    setTimeout(() => {
      redeemStatus.set(
        "INCORRECT"
        // "SERVER_ERROR"
        // "SUCCESS"
      );
    }, 1000);
  };

  return isPc ? (
    <button
      onClick={onClick}
      className="btn btn-lg rounded-3xl w-[40%] text-3xl"
    >
      Redeem
    </button>
  ) : (
    <label
      htmlFor="my-modal"
      className="btn btn-md btn-circle w-[60%] text-2xl"
      onClick={onClick}
    >
      Redeem
    </label>
  );
};

export default RedeemButton;
