import CloseModalButton from "./parent/CloseModalButton";

type Props = {
  className: string;
  text: string;
};

/**
 * redeemページからのサポートページ遷移用ボタン
 * @param param0
 * @returns
 */
const CustomerSupportButton: React.FC<Props> = ({ className, text }) => {
  const callback = () => {
    // TODO: サポートページに遷移
  };

  return (
    <CloseModalButton className={className} callback={callback}>
      {text}
    </CloseModalButton>
  );
};

export default CustomerSupportButton;
