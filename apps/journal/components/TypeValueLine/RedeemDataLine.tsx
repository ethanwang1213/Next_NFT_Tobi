import TypeValueLine from "./parent/TypeValueLine";

type Props = {
  lineType: string;
  lineValue: string;
  hidable?: boolean;
};

const RedeemDataLine: React.FC<Props> = ({ lineType, lineValue, hidable }) => {
  return (
    <TypeValueLine
      lineType={lineType}
      lineValue={lineValue}
      hidable={hidable}
      classNames={{
        container: ``,
        type: `text-xl`,
        value: `text-xl`,
      }}
    />
  );
};

export default RedeemDataLine;
