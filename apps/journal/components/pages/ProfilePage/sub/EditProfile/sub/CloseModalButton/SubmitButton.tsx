import CloseModalButton from "./CloseModalButton";
import { useAuth } from "@/contexts/AuthProvider";
import Jimp from "jimp";
import { postProfile, uploadNewIcon } from "@/libs/postProfile";
import processNewIcon from "@/libs/processNewIcon";
import { Area } from "react-easy-crop";

type Props = {
  modalId: string;
  className: string;
  children: React.ReactNode;
  callback?: () => void;

  iconUrl: string;
  cropData: Area;
  newName: string;
  isBirthdayHidden: boolean;
  selectedYear: number;
  selectedMonth: number;
  selectedDay: number;
};

/**
 * プロフィール編集モーダルの保存ボタン
 * @param param0
 * @returns
 */
const SubmitButton: React.FC<Props> = ({
  modalId,
  className,
  children,
  iconUrl,
  cropData,
  newName,
  isBirthdayHidden,
  selectedYear,
  selectedMonth,
  selectedDay,
}) => {
  const auth = useAuth();

  // 保存処理
  const handleSubmit = async () => {
    const isNewIcon = iconUrl !== auth.user.icon;
    if (isNewIcon) {
      // アイコン画像に変更があればアップロード
      const scaled = await processNewIcon(iconUrl, cropData);
      scaled.getBuffer(Jimp.MIME_PNG, async (err, buf) => {
        await uploadNewIcon(
          auth.user.id,
          new File([buf], "img.png", { type: "image/png" })
        );
      });
      // ローカルのプロフィール情報を更新
      scaled.getBase64(Jimp.MIME_PNG, async (err, src) => {
        auth.updateProfile(src, newName, isBirthdayHidden, {
          year: selectedYear,
          month: selectedMonth,
          day: selectedDay,
        });
      });
    } else {
      // ローカルのプロフィール情報を更新
      auth.updateProfile(iconUrl, newName, isBirthdayHidden, {
        year: selectedYear,
        month: selectedMonth,
        day: selectedDay,
      });
    }

    // データベース上のプロフィール情報を更新
    await postProfile(
      auth.user,
      isNewIcon,
      newName,
      isBirthdayHidden,
      selectedYear,
      selectedMonth,
      selectedDay
    );
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
