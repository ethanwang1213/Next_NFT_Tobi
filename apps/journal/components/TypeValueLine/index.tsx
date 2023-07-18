type Props = {
  lineType: string;
  lineValue: string;
};

/**
 * タイプと値を一行で表示するコンポーネント
 * hidableがtrueの場合、値を隠すことができる
 * @param param0
 * @returns
 */
const TypeValueLine: React.FC<Props> = ({ lineType, lineValue }) => {
  return (
    <div className={`w-full flex`}>
      <p className={`grow min-w-[60%]`}>{lineType}</p>
      <p className={`grow max-w-[40%] text-end`}>{lineValue}</p>
    </div>
  );
};

export default TypeValueLine;
