import styles from "./AttributeLine.module.scss";

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
    <div className={styles.container}>
      <div className={styles.type}>{type}</div>
      <div className={styles.value}>{value}</div>
    </div>
  );
};

export default AttributeLine;
