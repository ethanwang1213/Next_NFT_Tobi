import PageTitle from "../../PageTitle";
import NekoGrid from "./sub/NekoGrid";

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
      <PageTitle isShown={pageNum % 2 === 0} title="TOBIRA NEKO" />
      <div className="grow overflow-y-hidden">
        <div className={`hidden sm:block h-full`}>
          <NekoGrid pageNum={pageNum} nekoLength={4} />
        </div>
        <div className={`block sm:hidden h-full`}>
          <NekoGrid pageNum={pageNum} nekoLength={1} />
        </div>
      </div>
    </div>
  );
};

export default NekoPage;
