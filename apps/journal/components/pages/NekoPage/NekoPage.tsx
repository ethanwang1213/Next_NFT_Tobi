import NFTPageTitle from "../../PageTitle/NFTPageTitle";
import PageTitle from "../../PageTitle/parent/PageTitle";
import NekoGrid from "./sub/NekoGrid";
import NekoSwiper from "./sub/NekoSwiper/NekoSwiper";

type Props = {
  pageNum: number;
};

/**
 * TOBIRA NEKOの閲覧用ページ
 * @param param0
 * @returns
 */
const NekoPage: React.FC<Props> = ({ pageNum }) => {
  return (
    <div className="page">
      <div className={`hidden sm:block h-full`}>
        <NFTPageTitle isShown={pageNum % 2 === 0} title={"TOBIRA NEKO"} />
        <div className="grow overflow-y-hidden">
          <NekoGrid pageNum={pageNum} nekoLength={4} />
        </div>
      </div>
      <div className={`block sm:hidden h-full`}>
        <NekoSwiper />
      </div>
    </div>
  );
};

export default NekoPage;
