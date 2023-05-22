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
        placeholder="引き換えコードを入力してください"
        className={`${classNames.input} border-accent text-primary placeholder-primary/50 font-bold h-11 mb-2 sm:mb-0 shadow-[inset_0_5px_14px_0_rgba(0,0,0,0.3)]`}
        onChange={(e) => handleChange(e)}
        value={inputCode.current}
        disabled={redeemStatus.current === "CHECKING"}
      />
    </div>
  );
};

export default InputRedemptionCodeBox;
