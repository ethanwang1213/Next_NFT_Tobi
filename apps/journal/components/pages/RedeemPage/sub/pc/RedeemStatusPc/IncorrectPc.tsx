import CautionIcon from "../../../../../../public/images/icon/caution_journal.svg";
import { IconContainer, TitleContainer, DescriptionContainer } from ".";
import tailwindConfig from "@/tailwind.config.js";

/**
 * PC表示右ページの
 * コード不適合による引き換え失敗時の表示用コンポーネント
 * @returns
 */
const IncorrectPc: React.FC = () => {
  const { theme } = tailwindConfig;

  return (
    <>
      <IconContainer>
        <CautionIcon className="w-[40%] h-full" />
      </IconContainer>
      <TitleContainer
        title="Error"
        titleSize={theme.extend.fontSize.redeemStatus.pc.error}
      />
      <DescriptionContainer>
        <p className="sm:text-[35px] font-bold text-error mt-2 text-warning">
          シリアルコードが正しくありません。
        </p>
      </DescriptionContainer>
    </>
  );
};

export default IncorrectPc;
