type Props = {
  modalId: string;
  className: string;
  children: React.ReactNode;
  callback?: () => void;
  disabled?: boolean;
};

/**
 * redeemStatusをNONEに戻し、モーダルを閉じるボタン
 * @param param0
 * @returns
 */
const CloseModalButton: React.FC<Props> = ({
  modalId,
  className,
  children,
  callback,
  disabled = false,
}) => {
  const handleClick = () => {
    if (callback) {
      callback();
    }
  };

  return (
    <label
      htmlFor={modalId}
      className={`${className} ${disabled ? "btn-disabled" : ""}`}
      onClick={handleClick}
    >
      {children}
    </label>
  );
};

export default CloseModalButton;
