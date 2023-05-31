import ActivityRecordLine from "@/components/TypeValueLine/ActivityRecordLine";
import { useActivityRecord } from "@/contexts/ActivityRecordProvider";
import useDateFormat from "@/hooks/useDateFormat";

/**
 * アクティビティの記録を表示するコンポーネント
 * @returns
 */
const ActivityRecord: React.FC = () => {
  const { activityRecords } = useActivityRecord();
  const { formattedFromDate } = useDateFormat();

  return (
    <>
      {activityRecords.map((v, i) => (
        <ActivityRecordLine
          key={i}
          lineType={v.text}
          lineValue={formattedFromDate(v.date)}
        />
      ))}
    </>
  );
};

export default ActivityRecord;
