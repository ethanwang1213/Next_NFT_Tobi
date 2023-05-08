import { useContext } from "react";
import { RedeemContext } from "../../../../contexts/RedeemContextProvider";

type Props = {
  classNames: {
    input: string;
    p: string;
  };
};

const InputRedemptionCodeBox: React.FC<Props> = ({ classNames }) => {
  const { inputCode } = useContext(RedeemContext);

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Redemption Code"
        className={classNames.input}
        onChange={(e) => inputCode.set(e.target.value)}
        value={inputCode.current}
      />
      <p className={classNames.p}>NFT受け取りコードを入力してください。</p>
    </div>
  );
};

export default InputRedemptionCodeBox;
