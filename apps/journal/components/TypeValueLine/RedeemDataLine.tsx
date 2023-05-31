type Props = {
  dataType: string;
  dataValue: string;
};

/**
 * redeemページのデータ 一行を表示するコンポーネント
 * @param param0
 * @returns
 */
const RedeemDataLine: React.FC<Props> = ({ dataType, dataValue }) => {
  return (
    // <TypeValueLine
    //   lineType={lineType}
    //   lineValue={lineValue}
    //   hidable={hidable}
    //   classNames={{
    //     container: `text-[14px] sm:text-[30px] text-accent font-bold`,
    //     type: ``,
    //     value: ``,
    //   }}
    // />
    <>
      <div className="relative w-full text-center text-primary font-bold">
        <p className="text-[16px] sm:text-[28px] text-start mb-[-1%] sm:mb-4">
          {dataType}
        </p>
        <p className="text-[16px] sm:text-[28px] text-end leading-8">
          {dataValue}
        </p>
      </div>
    </>
  );
};

export default RedeemDataLine;
