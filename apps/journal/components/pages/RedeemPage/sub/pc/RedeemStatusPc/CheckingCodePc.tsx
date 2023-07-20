import FeatherIcon from "../../../../../../public/images/icon/feather_journal.svg";
import { IconContainer, TitleContainer } from ".";

/**
 * PC表示右ページの
 * コードチェック中の表示用コンポーネント
 * @returns
 */
const CheckingCodePc: React.FC = () => {
  return (
    <>
      <IconContainer isFade>
        <FeatherIcon className={"w-full h-full text-accent drop-shadow-lg"} />
      </IconContainer>
      <TitleContainer title={"Checking code..."} titleSize={72} />
    </>
  );
};

export default CheckingCodePc;
