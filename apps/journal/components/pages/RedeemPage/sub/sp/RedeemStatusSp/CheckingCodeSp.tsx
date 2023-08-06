import FeatherIcon from "../../../../../../public/images/icon/feather_journal.svg";
import { IconContainer, TitleContainer } from ".";

/**
 * スマホ表示モーダル内の
 * コードチェック中の表示用コンポーネント
 * @returns
 */
const CheckingCodeSp: React.FC = () => {
  return (
    <>
      <IconContainer isFade>
        <FeatherIcon className={"w-[68%] h-full"} />
      </IconContainer>
      <TitleContainer title={"Checking Code..."} titleSize={26} />
    </>
  );
};

export default CheckingCodeSp;
