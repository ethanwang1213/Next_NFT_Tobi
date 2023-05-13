import TypeValueLine from "./parent/TypeValueLine";

type Props = {
  lineType: string;
  lineValue: string;
  hidable?: boolean;
};

/**
 * redeemページのデータ 一行を表示するコンポーネント
 * @param param0
 * @returns
 */
const RedeemDataLine: React.FC<Props> = ({ lineType, lineValue, hidable }) => {
  return (
    <TypeValueLine
      lineType={lineType}
      lineValue={lineValue}
      hidable={hidable}
      classNames={{
        container: `text-[17px] sm:text-[30px] text-accent font-bold`,
        type: ``,
        value: ``,
      }}
    />
  );
};

export default RedeemDataLine;
