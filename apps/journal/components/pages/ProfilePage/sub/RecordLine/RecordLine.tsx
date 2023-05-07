type Props = {
  text: string;
  date: string;
};

/**
 * プロフィールのActivity Recordの一行
 * @param param0
 * @returns
 */
const RecordLine: React.FC<Props> = ({ text, date }) => {
  return (
    <div className="w-full flex">
      <p className="grow min-w-[60%] text-sm sm:text-base sm:font-bold">
        {text}
      </p>
      <p className="grow max-w-[40%] text-end text-xs sm:text-base sm:font-bold">
        {date}
      </p>
    </div>
  );
};

export default RecordLine;
