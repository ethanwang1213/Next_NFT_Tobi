import PageTitle from ".";

type Props = {
  isShown: boolean;
};

/**
 * redeemページのタイトルを表示するコンポーネント
 * @param param0
 * @returns
 */
const RedeemPageTitle: React.FC<Props> = ({ isShown }) => {
  return (
    <div
      className="grid content-center leading-[48px] sm:leading-[84px] 
        -mx-4 mb-0 sm:mb-8 h-[18%] min-h-[18%] sm:h-[214px] sm:min-h-[214px] "
    >
      <PageTitle isShown={isShown} title="REDEEM CODE" />
    </div>
  );
};

export default RedeemPageTitle;
