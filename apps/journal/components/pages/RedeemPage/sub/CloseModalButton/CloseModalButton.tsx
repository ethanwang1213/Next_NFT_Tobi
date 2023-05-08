import { useContext } from "react";
import { RedeemStatusContext } from "../../../../../contexts/RedeemStatusContextProvider";

type Props = {
  className: string;
  children: React.ReactNode;
  callback?: () => void;
};

const CloseModalButton: React.FC<Props> = ({
  className,
  callback,
  children,
}) => {
  const { set: setRedeemStatus } = useContext(RedeemStatusContext);

  const onClick = () => {
    // すぐにstatusを更新すると、モーダルを閉じるアニメーションが発生せず、
    // モーダルが開いたままになってしまうので、少し遅らせてからstatusを更新している
    setTimeout(() => {
      setRedeemStatus("NONE");
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
