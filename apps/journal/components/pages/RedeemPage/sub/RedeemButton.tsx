import { useContext } from "react";
import { RedeemStatusContext } from "../../../../contexts/RedeemStatusContextProvider";

type Props = {
  isPc: boolean;
};

const RedeemButton: React.FC<Props> = ({ isPc }) => {
  const { set: setRedeemContext } = useContext(RedeemStatusContext);

  const onClick = () => {
    setRedeemContext("CHECKING");
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
