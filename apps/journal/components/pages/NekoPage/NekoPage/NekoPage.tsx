import { useEffect, useState } from "react";
import styles from "./NekoPage.module.scss";
import NFTImage from "@/components/NFTImage/NFTImage";
import { MockNekoSrc, mockNekoSrcList } from "@/libs/mock/mockNekoSrcList";

type Props = {
  pageNum: number;
};

/**
 * TOBIRA NEKOの閲覧用ページ
 * 引数pageNumが偶数のとき左ページ、奇数のとき右ページとして表示する
 * また、nekoSrcListの要素数が1の時は1列、2以上の時は2列で表示する
 * @param param0
 * @returns
 */
const NekoPage: React.FC<Props> = ({ pageNum }) => {
  const [nekoSrcList, setNekoSrcList] = useState<MockNekoSrc[]>([]);
  const [isPC, setIsPC] = useState<boolean>(true);

  // TODO: 画像の読み込み
  const loadNekoSrcList = () => {
    // 読込方法は要検討
    //   const NEKO_NUM_PER_PAGE = 4;
    //   const firstId = NEKO_NUM_PER_PAGE * pageNum;
    //   loadNekoSrc(firstId);
    setNekoSrcList(mockNekoSrcList);
  };

  useEffect(() => {
    loadNekoSrcList();
  }, []);

  return (
    <div className="page">
      <div className={styles.titleContainer}>
        {pageNum % 2 === 0 && <h1 className={styles.title}>TOBIRA NEKO</h1>}
      </div>
      <div className={styles.nekoGrid}>
        {nekoSrcList.map((v) => (
          <NFTImage key={v.id} src={v.src} />
        ))}
      </div>
    </div>
  );
};

export default NekoPage;
