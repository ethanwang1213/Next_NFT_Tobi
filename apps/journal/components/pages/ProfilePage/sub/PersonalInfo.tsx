import HidableText from "@/components/HidableText";
import { useMemo } from "react";

type Props = {
  dataType: string;
  dataValue: string;
  hidable?: boolean;
};

/**
 * プロフィールの情報のコンポーネント
 * @param param0
 * @returns
 */
const PersonalInfo: React.FC<Props> = ({
  dataType,
  dataValue,
  hidable = false,
}) => {
  const value = useMemo(() => {
    if (dataValue === "-" || !hidable) {
      return <>{dataValue}</>;
    } else {
      return <HidableText text={dataValue} />;
    }
  }, [dataValue, hidable]);

  return (
    <>
      <div className="relative w-full text-center text-primary">
        <p className="text-[10px] sm:text-[20px] sm:text-start mb-[-2px] sm:mb-2">
          {dataType}
        </p>
        <div className="w-full">
          <p className="text-[14px] sm:text-[24px] font-bold  sm:text-end leading-8 break-all">
            {value}
          </p>
        </div>
      </div>
    </>
  );
};

export default PersonalInfo;
