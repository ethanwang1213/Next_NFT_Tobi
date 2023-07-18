import TypeValueLine from "./index";

type Props = {
  lineType: string;
  lineValue: string;
  hidable?: boolean;
};

/**
 * profileページの特徴データ 一行を表示するコンポーネント
 * @param param0
 * @returns
 */
const CharacteristicLine: React.FC<Props> = ({ lineType, lineValue }) => {
  return (
    <div className="text-sm sm:text-xl text-primary font-bold">
      <TypeValueLine lineType={lineType} lineValue={lineValue} />
    </div>
  );
};

export default CharacteristicLine;
