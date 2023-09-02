import { DescriptionContainer, IconContainer, TitleContainer } from ".";
import FeatherCheckIcon from "../../../../../../public/images/icon/feathercheck_journal.svg";
import CheckNftButton from "../../CloseModalButton/CheckNftButton";
import tailwindConfig from "@/tailwind.config.js";

/**
 * スマホ表示モーダル内の
 * 引き換え成功時の表示用コンポーネント
 * @returns
 */
const SuccessSp: React.FC = () => {
  const { theme } = tailwindConfig;

  return (
    <>
      <IconContainer>
        <FeatherCheckIcon className={"w-[60%] h-full"} />
      </IconContainer>
      <TitleContainer
        title={"Success!!"}
        titleSize={theme.extend.fontSize.redeemStatus.sp.success}
      />
      <DescriptionContainer>
        <CheckNftButton className="btn btn-secondary btn-md btn-circle text-lg w-[80%] mt-6 mb-2 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.6)]" />
      </DescriptionContainer>
    </>
  );
};

export default SuccessSp;
