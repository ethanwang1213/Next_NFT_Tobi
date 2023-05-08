import PageTitle from "./parent/PageTitle";

type Props = {
  isShown: boolean;
};

const NFTPageTitle: React.FC<Props> = ({ isShown }) => {
  return (
    <PageTitle
      isShown={isShown}
      className="h-[100px] min-h-[100px]"
      title="NFTs"
    />
  );
};

export default NFTPageTitle;
