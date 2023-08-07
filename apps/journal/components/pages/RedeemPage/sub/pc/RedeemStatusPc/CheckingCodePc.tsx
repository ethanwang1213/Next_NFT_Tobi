import FeatherIcon from "../../../../../../public/images/icon/feather_journal.svg";
import { IconContainer, TitleContainer } from ".";
import tailwindConfig from "@/tailwind.config.js";

/**
 * PC表示右ページの
 * コードチェック中の表示用コンポーネント
 * @returns
 */
const CheckingCodePc: React.FC = () => {
  const { theme } = tailwindConfig;

  return (
    <>
      <IconContainer isFade>
        <FeatherIcon className="w-full h-full text-accent drop-shadow-lg" />
      </IconContainer>
      <TitleContainer
        title="Checking code..."
        titleSize={theme.extend.fontSize.redeemStatus.pc.checking}
      />
    </>
  );
};

export default CheckingCodePc;
