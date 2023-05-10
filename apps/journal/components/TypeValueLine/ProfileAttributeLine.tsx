import TypeValueLine from "./parent/TypeValueLine";

type Props = {
  lineType: string;
  lineValue: string;
  hidable?: boolean;
};

/**
 * profileページの属性データ 一行を表示するコンポーネント
 * @param param0
 * @returns
 */
const ProfileAttributeLine: React.FC<Props> = ({
  lineType,
  lineValue,
  hidable,
}) => {
  return (
    <TypeValueLine
      lineType={lineType}
      lineValue={lineValue}
      hidable={hidable}
      classNames={{
        container: "",
        type: "",
        value: "",
      }}
    />
  );
};

export default ProfileAttributeLine;
