import { useEffect, useMemo } from "react";
import CloseModalButton from "./CloseModalButton";
import { postUserIcon } from "@/libs/postUserIcon";
import { useAuth } from "@/contexts/AuthProvider";
import Jimp from "jimp";
import scaleImage from "@/libs/scaleImage";

type Props = {
  modalId: string;
  className: string;
  children: React.ReactNode;
  callback?: () => void;

  iconFile: File | null;
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
  iconFile,
  iconUrl,
  newName,
  selectedYear,
  selectedMonth,
  selectedDay,
}) => {
  const auth = useAuth();
  const isDisabled = useMemo(
    () =>
      !iconUrl ||
      newName === "" ||
      !selectedYear ||
      !selectedMonth ||
      !selectedDay,
    [iconUrl, newName, selectedYear, selectedMonth, selectedDay]
  );

  const handleSubmit = async () => {
    if (!iconFile) return;
    // 保存処理
    console.log("ほぞん");
    const imgUrl = URL.createObjectURL(iconFile);
    const img = await scaleImage(imgUrl);
    img.getBuffer(Jimp.MIME_PNG, async (err, buf) => {
      const uploadedUrl = await postUserIcon(
        auth.id,
        new File([buf], "img.png", { type: "image/png" })
      );
      console.log(uploadedUrl);
    });
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
