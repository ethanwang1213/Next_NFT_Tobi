import TypeValueLine from "./parent/TypeValueLine";

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
const CharacteristicLine: React.FC<Props> = ({
  lineType,
  lineValue,
  hidable,
}) => {
  return (
    <TypeValueLine
      lineType={lineType}
      lineValue={lineValue}
      hidable={hidable}
      classNames={{
        container: "text-sm sm:text-xl text-primary font-bold",
        type: "",
        value: "",
      }}
    />
  );
};

export default CharacteristicLine;
