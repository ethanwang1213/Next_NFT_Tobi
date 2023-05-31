import { useMemo } from "react";
import HidableText from "../../../HidableWord";

type Props = {
  dataType: string;
  dataValue: string;
  hidable?: boolean;
};

/**
 * redeemページのデータ 一行を表示するコンポーネント
 * @param param0
 * @returns
 */
const RedeemDataLine: React.FC<Props> = ({
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
      <div className="relative w-full text-center text-primary font-bold">
        <p className="text-[16px] sm:text-[28px] text-start mb-[2%] sm:mb-4">
          {dataType}
        </p>
        <p className="text-[16px] sm:text-[28px] text-end leading-10">
          {value}
        </p>
      </div>
    </>
  );
};

export default RedeemDataLine;
