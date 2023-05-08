import CloseModalButton from "./CloseModalButton";

type Props = {
  className: string;
};

const CheckNFTButton: React.FC<Props> = ({ className }) => {
  const callback = () => {
    // TODO: NEKO一覧ページに遷移
    // ゆくゆくはNEKOの場合と他のNFTの場合で遷移先を変える
  };

  return (
    <CloseModalButton className={className} callback={callback}>
      Check your NFTs
    </CloseModalButton>
  );
};

export default CheckNFTButton;
