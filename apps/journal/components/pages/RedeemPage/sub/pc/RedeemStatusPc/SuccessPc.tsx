import { IconContainer, TitleContainer, DescriptionContainer } from ".";
import FeatherCheckIcon from "../../../../../../public/images/icon/feathercheck_journal.svg";
import CheckNftButton from "../../CloseModalButton/CheckNftButton";
import tailwindConfig from "@/tailwind.config.js";

/**
 * PC表示右ページの
 * 引き換え成功時の表示用コンポーネント
 * @returns
 */
const SuccessPc: React.FC = () => {
  const { theme } = tailwindConfig;

  return (
    <>
      <IconContainer>
        <FeatherCheckIcon className={"w-full h-full "} />
      </IconContainer>
      <TitleContainer
        title={"Success!!"}
        titleSize={theme.extend.fontSize.redeemStatus.pc.success}
      />
      <DescriptionContainer>
        <CheckNftButton
          className="btn btn-outline btn-lg btn-accent rounded-3xl text-3xl w-[60%] sm:h-[74px] sm:text-[32px] border-4 
            absolute bottom-[5%] drop-shadow-[0px_4px_2px_rgba(0,0,0,0.3)]"
        />
      </DescriptionContainer>
    </>
  );
};

export default SuccessPc;
