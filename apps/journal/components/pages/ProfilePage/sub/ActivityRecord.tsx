import ActivityRecordLine from "@/components/TypeValueLine/ActivityRecordLine";
import { useActivityRecord } from "@/contexts/ActivityRecordProvider";
import { useDebug } from "@/contexts/DebugProvider";
import useDateFormat from "@/hooks/useDateFormat";
import { mockRecordList } from "@/libs/mocks/mockProfile0";
import { useMemo } from "react";

/**
 * アクティビティの記録を表示するコンポーネント
 * @returns
 */
const ActivityRecord: React.FC = () => {
  const { activityRecords } = useActivityRecord();
  const { formattedFromDate } = useDateFormat();

  // DEBUG用
  const { shouldRefresh } = useDebug();
  // 表示するmockレコードの数をランダムに決定
  const mockRecordNum = useMemo(
    () => Math.floor(Math.random() * mockRecordList.length),
    [shouldRefresh]
  );

  return (
    <>
      {process.env.NEXT_PUBLIC_DEBUG_MODE!
        ? mockRecordList
            .slice(0, mockRecordNum)
            .map((v, i) => (
              <ActivityRecordLine
                key={i}
                lineType={v.text}
                lineValue={formattedFromDate(v.date)}
              />
            ))
        : activityRecords.map((v, i) => (
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
