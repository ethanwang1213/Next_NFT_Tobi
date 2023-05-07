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
      <p className={styles.type}>{type}</p>
      <p className={styles.value}>{value}</p>
    </div>
  );
};

export default AttributeLine;
