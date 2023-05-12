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
        container: ``,
        type: `text-xl text-accent`,
        value: `text-xl text-accent`,
      }}
    />
  );
};

export default RedeemDataLine;
