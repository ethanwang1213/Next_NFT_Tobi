type Props = {
  type: string;
  value: string;
};

/**
 * プロフィールの各種情報の一行
 * @param param0
 * @returns
 */
const AttributeLine: React.FC<Props> = ({ type, value }) => {
  return (
    <div className="w-full flex">
      <p className="min-w-[60%] text-sm sm:text-base font-bold">{type}</p>
      <p className="grow max-w-[40%] text-end text-sm sm:text-base font-bold">
        {value}
      </p>
    </div>
  );
};

export default AttributeLine;
