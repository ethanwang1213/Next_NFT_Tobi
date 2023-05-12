type Props = {
  dataType: string;
  dataValue: string;
};

/**
 * プロフィールの情報のコンポーネント
 * @param param0
 * @returns
 */
const PersonalInfo: React.FC<Props> = ({ dataType, dataValue }) => {
  return (
    <>
      <div className="relative w-full text-center text-primary">
        <p className="text-xs sm:text-[20px] sm:text-start mb-10">{dataType}</p>
        <p className="text-base sm:text-[28px] font-bold sm:absolute sm:bottom-0 sm:right-0">
          {dataValue}
        </p>
      </div>
    </>
  );
};

export default PersonalInfo;
