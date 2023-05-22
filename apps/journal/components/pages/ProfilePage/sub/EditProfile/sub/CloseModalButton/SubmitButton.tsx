import { useEffect, useMemo } from "react";
import CloseModalButton from "./CloseModalButton";

type Props = {
  modalId: string;
  className: string;
  children: React.ReactNode;
  callback?: () => void;

  iconBlob: Blob | null;
  iconUrl: string;
  newName: string;
  selectedYear: number;
  selectedMonth: number;
  selectedDay: number;
};

/**
 * redeemStatusをNONEに戻し、モーダルを閉じるボタン
 * @param param0
 * @returns
 */
const SubmitButton: React.FC<Props> = ({
  modalId,
  className,
  children,
  iconBlob,
  iconUrl,
  newName,
  selectedYear,
  selectedMonth,
  selectedDay,
}) => {
  const isDisabled = useMemo(
    () =>
      !iconUrl ||
      newName === "" ||
      !selectedYear ||
      !selectedMonth ||
      !selectedDay,
    [iconUrl, newName, selectedYear, selectedMonth, selectedDay]
  );

  const handleSubmit = () => {
    // 保存処理
    console.log("ほぞん");
    
  };

  return (
    <CloseModalButton
      modalId={modalId}
      className={className}
      callback={handleSubmit}
      disabled={isDisabled}
    >
      {children}
    </CloseModalButton>
  );
};

export default SubmitButton;
