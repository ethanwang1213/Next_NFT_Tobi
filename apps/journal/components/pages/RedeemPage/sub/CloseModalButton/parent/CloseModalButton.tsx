import { useContext } from "react";
import { RedeemContext } from "../../../../../../contexts/RedeemContextProvider";

type Props = {
  className: string;
  children: React.ReactNode;
  callback?: () => void;
};

/**
 * redeemStatusをNONEに戻し、モーダルを閉じるボタン
 * @param param0
 * @returns
 */
const CloseModalButton: React.FC<Props> = ({
  className,
  callback,
  children,
}) => {
  const { redeemStatus } = useContext(RedeemContext);

  const onClick = () => {
    // すぐにstatusを更新すると、モーダルを閉じるアニメーションが発生せず、
    // モーダルが開いたままになってしまうので、少し遅らせてからstatusを更新している
    setTimeout(() => {
      redeemStatus.set("NONE");
    }, 300);

    if (callback) {
      callback();
    }
  };

  return (
    <label htmlFor="my-modal" className={className} onClick={onClick}>
      {children}
    </label>
  );
};

export default CloseModalButton;
