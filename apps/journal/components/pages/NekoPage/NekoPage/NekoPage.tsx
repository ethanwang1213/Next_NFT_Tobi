import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./NekoPage.module.scss";

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
  const [nekoSrcList, setNekoSrcList] = useState<string[]>([]);

  // TODO: 画像の読み込み
  const loadNekoSrcList = () => {
    // 読込方法は要検討
    // const NEKO_NUM_PER_PAGE = 4;
    // const firstId = NEKO_NUM_PER_PAGE * pageNum;
    // loadNekoSrc(firstId);
    return [
      "/mock/images/neko.png",
      "/mock/images/neko.png",
      "/mock/images/neko.png",
      "/mock/images/neko.png",
    ];
  };

  useEffect(() => {
    setNekoSrcList(loadNekoSrcList());
  }, []);

  return (
    <div className="page">
      <div className={styles.titleContainer}>
        {pageNum % 2 === 0 && <h1 className={styles.title}>TOBIRA NEKO</h1>}
      </div>
      <div
        className={`${nekoSrcList.length <= 1 ? styles.grid1 : styles.grid2}`}
      >
        {nekoSrcList.map((v, i) => (
          <div key={i} className="relative w-full aspect-square">
            <Image src={v} alt="neko" fill />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NekoPage;
