import { useContext } from "react";
import CloseModalButton from ".";
import { useBookContext } from "@/contexts/journal-BookProvider";

type Props = {
  className: string;
};

/**
 * redeemページからのNEKO/NFT一覧ページ遷移用ボタン
 * @param param0
 * @returns
 */
const CheckNftButton: React.FC<Props> = ({ className }) => {
  const { pageNo, bookIndex } = useBookContext();

  const callback = () => {
    // TODO: ゆくゆくはNEKOの場合と他のNFTの場合で遷移先を変える
    pageNo.set(bookIndex.nekoPage.start);
  };

  return (
    <CloseModalButton className={className} callback={callback}>
      NFTを確認する
    </CloseModalButton>
  );
};

export default CheckNftButton;
