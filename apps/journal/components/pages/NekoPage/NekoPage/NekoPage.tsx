import PageTitle from "@/components/PageTitle/PageTitle";
import NekoGrid from "../sub/NekoGrid/NekoGrid";
import styles from "./NekoPage.module.scss";

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
      <div className={styles.content}>
        <div className={`hidden sm:block ${styles.grid}`}>
          <NekoGrid pageNum={pageNum} nekoLength={4} />
        </div>
        <div className={`block sm:hidden ${styles.grid}`}>
          <NekoGrid pageNum={pageNum} nekoLength={1} />
        </div>
      </div>
    </div>
  );
};

export default NekoPage;
