import PageTitle from "./parent/PageTitle";

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
    <PageTitle
      isShown={isShown}
      className="h-[120px] min-h-[120px] sm:h-[214px] sm:min-h-[214px] grid content-center"
      title="Redeem Code"
    />
  );
};

export default RedeemPageTitle;
