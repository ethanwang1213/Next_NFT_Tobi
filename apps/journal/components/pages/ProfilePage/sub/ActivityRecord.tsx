import ActivityRecordLine from "@/components/TypeValueLine/ActivityRecordLine";
import { useActivityRecord } from "@/contexts/ActivityRecordProvider";

const ActivityRecord: React.FC = () => {
  const { activityRecords } = useActivityRecord();

  return (
    <>
      {activityRecords.map((v, i) => (
        <ActivityRecordLine
          key={i}
          lineType={v.text}
          lineValue={v.date.toLocaleDateString()}
        />
      ))}
    </>
  );
};

export default ActivityRecord;
