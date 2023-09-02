import FeatherIcon from "../../../../../../public/images/icon/feather_journal.svg";
import { IconContainer, TitleContainer } from ".";
import tailwindConfig from "@/tailwind.config.js";

/**
 * スマホ表示モーダル内の
 * コードチェック中の表示用コンポーネント
 * @returns
 */
const CheckingCodeSp: React.FC = () => {
  const { theme } = tailwindConfig;

  return (
    <>
      <IconContainer isFade>
        <FeatherIcon className={"w-[68%] h-full"} />
      </IconContainer>
      <TitleContainer
        title={"Checking Code..."}
        titleSize={theme.extend.fontSize.redeemStatus.sp.checking}
      />
    </>
  );
};

export default CheckingCodeSp;
