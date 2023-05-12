import { useContext } from "react";
import { RedeemContext } from "../../../../contexts/RedeemContextProvider";

type Props = {
  classNames: {
    input: string;
    p: string;
  };
};

/**
 * redeem code入力ボックスのコンポーネント
 * 値はRedeemContextのinputCodeに保存される
 * @param param0
 * @returns
 */
const InputRedemptionCodeBox: React.FC<Props> = ({ classNames }) => {
  const { redeemStatus, inputCode, modalInputIsChecked } =
    useContext(RedeemContext);

  const handleChange = (e) => {
    // テキストボックスを操作し始めたらモーダルを閉じる
    //  スマホ表示でモーダルがエラーが表示されていても、PC表示ではテキストボックスを操作できる
    //  PC表示でテキストボックスを操作し始めたら、スマホ表示でもモーダルを閉じてよいという考えでこうしている
    if (modalInputIsChecked.current) {
      modalInputIsChecked.set(false);
    }

    inputCode.set(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Redemption Code"
        className={`${classNames.input} border-accent text-primary placeholder-primary/80`}
        onChange={(e) => handleChange(e)}
        value={inputCode.current}
        disabled={redeemStatus.current === "CHECKING"}
      />
      <p className={`${classNames.p} text-accent`}>
        NFT受け取りコードを入力してください。
      </p>
    </div>
  );
};

export default InputRedemptionCodeBox;
