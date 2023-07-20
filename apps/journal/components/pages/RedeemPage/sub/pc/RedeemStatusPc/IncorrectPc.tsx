import CautionIcon from "../../../../../../public/images/icon/caution_journal.svg";
import { IconContainer, TitleContainer, DescriptionContainer } from ".";

/**
 * PC表示右ページの
 * コード不適合による引き換え失敗時の表示用コンポーネント
 * @returns
 */
const IncorrectPc: React.FC = () => {
  return (
    <>
      <IconContainer>
        <CautionIcon className={"w-[40%] h-full"} />
      </IconContainer>
      <TitleContainer title={"Error"} titleSize={84} />
      <DescriptionContainer>
        <p className="sm:text-[35px] font-bold text-error mt-2 text-warning">
          シリアルコードが正しくありません。
        </p>
      </DescriptionContainer>
    </>
  );
};

export default IncorrectPc;
