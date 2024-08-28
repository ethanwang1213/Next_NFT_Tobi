type Props = {
  title: string;
  titleSize: number;
};

/**
 * pcでの引き換え処理のステータス表示の
 * タイトル部分のコンポーネント
 * @param param0
 * @returns
 */
const TitleContainer: React.FC<Props> = ({ title, titleSize }) => {
  return (
    <h3
      className="w-full grow min-h-[30px] text-text-1000 font-bold grid content-center drop-shadow-lg"
      style={{
        fontSize: `${titleSize}px`,
      }}
    >
      {title}
    </h3>
  );
};

export default TitleContainer;
