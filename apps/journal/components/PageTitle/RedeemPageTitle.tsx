import PageTitle from "./parent/PageTitle";

type Props = {
  isShown: boolean;
};

const RedeemPageTitle: React.FC<Props> = ({ isShown }) => {
  return (
    <PageTitle
      isShown={isShown}
      className="h-[150px] min-h-[150px] sm:h-[200px] sm:min-h-[200px] grid content-center"
      title="Redeem Code"
    />
  );
};

export default RedeemPageTitle;
