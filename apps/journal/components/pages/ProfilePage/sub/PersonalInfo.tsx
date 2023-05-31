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
        <p className="text-[10px] sm:text-[20px] sm:text-start mb-[-2px] sm:mb-2">
          {dataType}
        </p>
        <p className="text-[14px] sm:text-[24px] font-bold  sm:text-end leading-8">
          {dataValue}
        </p>
      </div>
    </>
  );
};

export default PersonalInfo;
