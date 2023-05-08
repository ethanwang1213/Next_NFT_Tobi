type Props = {
  classNames: {
    input: string;
    p: string;
  };
};

const InputRedemptionCodeBox: React.FC<Props> = ({ classNames }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Enter Redemption Code"
        className={classNames.input}
      />
      <p className={classNames.p}>NFT受け取りコードを入力してください。</p>
    </div>
  );
};

export default InputRedemptionCodeBox;
