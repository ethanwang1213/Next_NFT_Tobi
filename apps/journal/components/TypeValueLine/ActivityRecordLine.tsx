import TypeValueLine from "./parent/TypeValueLine";

type Props = {
  lineType: string;
  lineValue: string;
  hidable?: boolean;
};

/**
 * profileページのActivityRecord 一行を表示するコンポーネント
 * @param param0
 * @returns
 */
const ActivityRecordLine: React.FC<Props> = ({
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
        container: "",
        type: "text-xs sm:text-lg font-normal sm:font-bold text-primary",
        value: "text-xs sm:text-lg font-normal sm:font-bold text-primary",
      }}
    />
  );
};

export default ActivityRecordLine;
