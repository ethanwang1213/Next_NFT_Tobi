import { useRedeemStatus } from "../../../../../contexts/journal-RedeemStatusProvider";

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
  const { redeemStatus, modalInputIsChecked } = useRedeemStatus();

  const onClick = () => {
    modalInputIsChecked.set(false);

    // すぐにstatusを更新すると、空になったモーダルがアニメーション中に見えてしまうので、
    // 少し遅らせてからstatusを更新している
    setTimeout(() => {
      redeemStatus.set("NONE");
    }, 300);

    if (callback) {
      callback();
    }
  };

  return (
    <label htmlFor="redeem-modal" className={className} onClick={onClick}>
      {children}
    </label>
  );
};

export default CloseModalButton;
