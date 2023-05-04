import PageTitle from "@/components/PageTitle/PageTitle";
import NFTPagePC from "../sub/NFTPagePC/NFTPagePC";
import NFTPageSP from "../sub/NFTPageSP/NFTPageSP";

type Props = {
  pageNum: number;
};

/**
 * 所有NFTの閲覧用ページ
 * PC表示について、引数pageNumが偶数のとき左ページ、奇数のとき右ページとして表示する
 * スマホ表示について、NFTはスクロールで表示される。
 */
const NFTPage: React.FC<Props> = ({ pageNum }) => {
  return (
    <div className="page">
      <PageTitle isShown={pageNum % 2 === 0} title="NFTs" />
      <>
        <div className="hidden sm:block grow overflow-y-hidden">
          <NFTPagePC pageNum={pageNum} />
        </div>
        <div className="block sm:hidden grow overflow-y-auto">
          <NFTPageSP pageNum={pageNum} />
        </div>
      </>
    </div>
  );
};

export default NFTPage;
