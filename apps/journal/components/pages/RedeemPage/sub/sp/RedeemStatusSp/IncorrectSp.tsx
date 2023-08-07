import { DescriptionContainer, IconContainer, TitleContainer } from ".";
import CautionIcon from "../../../../../../public/images/icon/caution_journal.svg";
import TryAgainButton from "../../CloseModalButton/TryAgainButton";
import tailwindConfig from "@/tailwind.config.js";

/**
 * スマホ表示モーダル内の
 * コード不適合による引き換え失敗時の表示用コンポーネント
 * @returns
 */
const IncorrectSp: React.FC = () => {
  const { theme } = tailwindConfig;

  return (
    <>
      <IconContainer>
        <CautionIcon className={"w-[54%] h-full"} />
      </IconContainer>
      <TitleContainer
        title={"Error"}
        titleSize={theme.extend.fontSize.redeemStatus.sp.error}
      />
      <DescriptionContainer>
        <div>
          <p className="font-bold text-error text-[17px] grid content-center mb-8">
            シリアルコードが正しくありません。
          </p>
          <TryAgainButton
            className="btn btn-secondary btn-md btn-circle text-lg w-[88%] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.5)]"
            text="戻る"
          />
        </div>
      </DescriptionContainer>
    </>
  );
};

export default IncorrectSp;
