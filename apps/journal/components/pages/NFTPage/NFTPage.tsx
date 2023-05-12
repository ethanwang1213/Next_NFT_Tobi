import NFTPageTitle from "../../PageTitle/NFTPageTitle";
import PageTitle from "../../PageTitle/parent/PageTitle";
import NFTPagePC from "./sub/NFTPagePC";
import NFTPageSP from "./sub/NFTPageSP";

type Props = {
  pageNum: number;
};

/**
 * 所有NFTの閲覧用ページ
 */
const NFTPage: React.FC<Props> = ({ pageNum }) => {
  return (
    <>
      <NFTPageTitle
        isShown={pageNum % 2 === 0}
        title={
          <>
            COLLECTION
            <br />
            LIBRARY
          </>
        }
      />
      <>
        <div className="hidden sm:block grow overflow-y-hidden">
          <NFTPagePC pageNum={pageNum} />
        </div>
        <div className="block sm:hidden grow overflow-y-auto">
          <NFTPageSP pageNum={pageNum} />
        </div>
      </>
    </>
  );
};

export default NFTPage;
