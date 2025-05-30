import TypeValueLine from ".";

type Props = {
  lineType: string;
  lineValue: string;
};

/**
 * profileページのActivityRecord 一行を表示するコンポーネント
 * @param param0
 * @returns
 */
const ActivityRecordLine: React.FC<Props> = ({ lineType, lineValue }) => {
  return (
    <div className="text-xs sm:text-[1.18rem] sm:leading-[1.75rem] text-primary font-normal sm:font-bold">
      <TypeValueLine lineType={lineType} lineValue={lineValue} />
    </div>
  );
};

export default ActivityRecordLine;
