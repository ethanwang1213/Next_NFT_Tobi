import { useEffect, useMemo } from "react";
import CloseModalButton from "./CloseModalButton";
import { useAuth } from "@/contexts/AuthProvider";
import Jimp from "jimp";
import scaleImage from "@/libs/scaleImage";
import { postProfile, uploadNewIcon } from "@/libs/postProfile";

type Props = {
  modalId: string;
  className: string;
  children: React.ReactNode;
  callback?: () => void;

  iconFile: File | null;
  iconUrl: string;
  newName: string;
  isBirthdayHidden: boolean;
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
  iconUrl,
  newName,
  isBirthdayHidden,
  selectedYear,
  selectedMonth,
  selectedDay,
}) => {
  const auth = useAuth();

  const handleSubmit = async () => {
    // 保存処理
    console.log("ほぞん");
    const isNewIcon = iconUrl !== auth.user.icon;
    // アイコン画像に変更があればアップロード
    if (isNewIcon) {
      const scaled = await scaleImage(iconUrl);
      scaled.getBuffer(Jimp.MIME_PNG, async (err, buf) => {
        await uploadNewIcon(
          auth.user.id,
          new File([buf], "img.png", { type: "image/png" })
        );
      });
    }
    // プロフィール情報を更新
    await postProfile(
      auth.user,
      isNewIcon,
      newName,
      isBirthdayHidden,
      selectedYear,
      selectedMonth,
      selectedDay
    );
    auth.updateProfile(iconUrl, newName, isBirthdayHidden, {
      year: selectedYear,
      month: selectedMonth,
      day: selectedDay,
    });
  };

  return (
    <CloseModalButton
      modalId={modalId}
      className={className}
      callback={handleSubmit}
    >
      {children}
    </CloseModalButton>
  );
};

export default SubmitButton;
