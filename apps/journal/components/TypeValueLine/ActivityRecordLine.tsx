import TypeValueLine from "./index";

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
    <div className="text-xs sm:text-xl text-primary font-normal sm:font-bold">
      <TypeValueLine lineType={lineType} lineValue={lineValue} />
    </div>
  );
};

export default ActivityRecordLine;
